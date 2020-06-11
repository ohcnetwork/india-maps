import React, { useState, useEffect } from "react";
import {
  Circle,
  Map,
  Marker,
  Popup,
  // Tooltip,
  TileLayer
} from "react-leaflet";
import { readRemoteFile } from "react-papaparse";
import geoLocation from "../data/geoLocation.js";
import districtGeoLocation from "../data/districtGeoLocation.js";
import testCenters from "../data/testCenters.js";

let center = [9.5915668, 76.5221531];
const papaparseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
};

// to aggregate data by state+country and sum up metrics
const groupMetricsByStateAndCountry = (data) => {
  const internationalDataLookup = Array.isArray(data)
    ? data
    .filter((data) => data.lat && data.long_)
    .reduce((intLookup, data) => {
      const key = `${data.province_state}.${data.country_region}`;
      if (intLookup[key]) {
        intLookup[key] = {
          ...intLookup[key],
          deaths: intLookup[key].deaths + data.deaths,
          confirmed: intLookup[key].confirmed + data.confirmed,
          recovered: intLookup[key].recovered + data.recovered,
          active: intLookup[key].active + data.active,
        };
        return intLookup;
      }
      intLookup[key] = data;
      return intLookup
    }, {})
    : {};
  return Object.keys(internationalDataLookup).map(key => internationalDataLookup[key]);
}

export default function MapContainer(props) {
  const {
    onStateWiseDataGetSuccess,
    onDistrictWiseDataGetSuccess,
    viewTestCenters,
    selectedLocCoordinate
  } = props;

  if (selectedLocCoordinate && selectedLocCoordinate.length) {
    center = [
      selectedLocCoordinate[0].latitude,
      selectedLocCoordinate[0].longitude
    ];
  }
  const [indiaData, setIndiaData] = useState(null);

  const [stateData, setStateData] = useState(null);
  const [countrySummary, setCountrySummary] = useState(null);

  const [districtData, setDistrictData] = useState(null);

  const [internationalData, setInternationalData] = useState([]);
  const [countryStats, setCountryStats] = useState(null);
  const [worldStats, setWorldStats] = useState(null);

  // const [viewTestCenters, setViewTestCenters] = useState(false);
  const [showInfoHead, setShowInfoHead] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);

  const parseInternationalData = ({ data }) => {
    setInternationalData(groupMetricsByStateAndCountry(data));
    Array.isArray(data) &&
      setWorldStats(
        data.reduce((a, b) => ({
          confirmed: a.confirmed + b.confirmed,
          deaths: a.deaths + b.deaths,
          recovered: a.recovered + b.recovered
        }))
      );
  };
  useEffect(() => {
    if (countrySummary)
      if (indiaData.countryData)
        if (
          countrySummary.confirmedCasesIndian +
          countrySummary.confirmedCasesForeign >
          indiaData.countryData.total
        )
          setIndiaData(null);
  }, [stateData, indiaData]);
  useEffect(() => {
    console.log("Fetching Data");
    fetch("https://exec.clay.run/kunksed/mohfw-covid")
      .then(res => res.json())
      .then(
        result => {
          // console.log("Received Response")
          setIndiaData(result);
        },
        error => {
          // console.log("Error Response")
        }
      );
    fetch("https://volunteer.coronasafe.network/api/reports")
      .then(res => res.json())
      .then(
        result => {
          console.log("Received Response" + result);
          onDistrictWiseDataGetSuccess
            ? onDistrictWiseDataGetSuccess(result)
            : (() => { })();
          setDistrictData(result);
        },
        error => {
          console.log("Error Response");
        }
      );

    fetch("https://api.rootnet.in/covid19-in/stats/latest")
      .then(res => res.json())
      .then(
        result => {
          console.log("Received Response" + result);
          onStateWiseDataGetSuccess
            ? onStateWiseDataGetSuccess(result.data)
            : (() => { })();
          setStateData(
            Object.assign(
              {},
              ...result.data.regional.map(
                ({
                  loc,
                  confirmedCasesIndian,
                  confirmedCasesForeign,
                  deaths,
                  discharged
                }) => ({
                  [loc]: {
                    confirmedCasesIndian,
                    confirmedCasesForeign,
                    deaths,
                    discharged
                  }
                })
              )
            )
          );

          setCountrySummary(result.data.summary);
        },
        error => {
          console.log("Error Response");
        }
      );

    const tryYesterday = date => {
      date.setDate(date.getDate() - 1);
      const formattedDate =
        (date.getMonth() > 8
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1)) +
        "-" +
        (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
        "-" +
        date.getFullYear();
      // console.log(formattedDate);
      readRemoteFile(
        "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/" +
        formattedDate +
        ".csv",
        {
          ...papaparseOptions,
          complete: parseInternationalData,
          error: () => tryYesterday(date)
        }
      );
    };
    const date = new Date();
    const formattedDate =
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "-" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      "-" +
      date.getFullYear();
    readRemoteFile(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/" +
      formattedDate +
      ".csv",
      {
        ...papaparseOptions,
        complete: parseInternationalData,
        error: () => tryYesterday(date)
      }
    );
  }, []);
  console.log(viewTestCenters);

  const findRadius = cases => {
    return (Math.cbrt(cases)) * 1500
  }
  return (
      <Map 
        className="h-screen w-full fixed" 
        center={center} 
        zoom={7} 
        minZoom={3} 
        maxBounds={[[90,-270],[-90,-270],[90,360],[-90,360]]}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        />
        {indiaData && indiaData.stateData
          ? geoLocation.map(location => {
            console.log(
              location.state +
              "|" +
              JSON.stringify(indiaData.stateData[location.state])
            );
            const locationData = indiaData.stateData[location.state];
            if (locationData.cases === 0 || location.state === "Kerala")
              return null;
            return (
              <Circle
                key={location.state}
                center={[location.latitude, location.longitude]}
                fillColor="#d14f69"
                fillOpacity={0.6}
                stroke={false}
                radius={15000 + findRadius(locationData.cases)}
                onMouseOver={e => {
                  firstLoad && setFirstLoad(false);
                  e.target.openPopup();
                }}
              >
                <Popup>
                  <h3>{location.state}</h3>
                      Cases: {locationData.cases}
                      Cured/Discharged: {locationData.cured_discharged}
                      Deaths: {locationData.Deaths}
                      Helpline: {locationData.helpline}
                </Popup>
              </Circle>
            );
          })
          : stateData &&
          geoLocation.map(location => {
            // console.log(location.state + "|" + JSON.stringify(indiaData.stateData[location.state]))
            const locationData = stateData[location.state];
            if (
              locationData === undefined ||
              (locationData.confirmedCasesIndian === 0 &&
                locationData.confirmedCasesForeign === 0) ||
              location.state === "Kerala"
            )
              return null;
            return (
              <Circle
                key={location.state}
                center={[location.latitude, location.longitude]}
                fillColor="#d14f69"
                fillOpacity={0.6}
                stroke={false}
                radius={
                  15000 + findRadius(locationData.confirmedCasesIndian + locationData.confirmedCasesForeign)
                }
                onMouseOver={e => {
                  firstLoad && setFirstLoad(false);
                  e.target.openPopup();
                }}
              >

                {
                  (locationData.discharged) ?
                    <Circle
                      key={`discharged-${location.state}`}
                      center={[location.latitude, location.longitude]}
                      fillColor="#1df500"
                      fillOpacity={0.7}
                      stroke={false}
                      radius={400 +findRadius(locationData.discharged)}
                      onMouseOver={e => {
                        firstLoad && setFirstLoad(false);
                        e.target.openPopup();
                      }}
                    ></Circle> : null
                }
                {
                  (locationData.deaths) ?
                    <Circle
                      key={`deaths-${location.state}`}
                      center={[location.latitude, location.longitude]}
                      fillColor="#f55600"
                      fillOpacity={0.9}
                      stroke={false}
                      radius={findRadius(locationData.deaths)/2}
                      onMouseOver={e => {
                        firstLoad && setFirstLoad(false);
                        e.target.openPopup();
                      }}
                    ></Circle> : null
                }
                <Popup>
                  <h3>{location.state}</h3>
                      Cases: {
                        locationData.confirmedCasesIndian +
                        locationData.confirmedCasesForeign
                      }
                      Cured/Discharged: {locationData.discharged}
                      Deaths: {locationData.deaths}
                </Popup>
              </Circle>
            );
          })}
        {districtData &&
          districtGeoLocation.map(location => {
            // console.log(location.state + "|" + JSON.stringify(indiaData.stateData[location.state]))
            const locationData = districtData.kerala[location.district];
            if (
              locationData === undefined ||
              locationData.corona_positive === 0
            )
              return null;
            return (
              <Circle
                key={location.district}
                center={[location.latitude, location.longitude]}
                fillColor="#d14f69"
                fillOpacity={0.6}
                stroke={false}
                radius={15000 + findRadius(locationData.corona_positive)}
                onMouseOver={e => {
                  firstLoad && setFirstLoad(false);
                  e.target.openPopup();
                }}
              >


                {
                  (locationData.total_hospitalised) ?
                    <Circle
                      key={`hospitilized-${location.district}`}
                      center={[location.latitude, location.longitude]}
                      fillColor="#04dbd4"
                      fillOpacity={0.8}
                      stroke={false}
                      radius={findRadius(locationData.total_hospitalised)/4}
                      onMouseOver={e => {
                        firstLoad && setFirstLoad(false);
                        e.target.openPopup();
                      }}
                    ></Circle> : null
                }
                {
                  (locationData.cured_discharged) ?
                    <Circle
                      key={`cured-${location.district}`}
                      center={[location.latitude, location.longitude]}
                      fillColor="#1df500"
                      fillOpacity={0.7}
                      stroke={false}
                      radius={400 +findRadius(locationData.cured_discharged)}
                      onMouseOver={e => {
                        firstLoad && setFirstLoad(false);
                        e.target.openPopup();
                      }}
                    ></Circle> : null
                }
                {
                  (locationData.deaths) ?
                    <Circle
                      key={`deaths-${location.district}`}
                      center={[location.latitude, location.longitude]}
                      fillColor="#f55600"
                      fillOpacity={0.9}
                      stroke={false}
                      radius={findRadius(locationData.deaths)/2}
                      onMouseOver={e => {
                        firstLoad && setFirstLoad(false);
                        e.target.openPopup();
                      }}
                    ></Circle> : null
                }
                {location.state !== "Kerala" && (
                  // firstLoad ?
                  // <Tooltip permanent>
                  // <h3>{location.state}</h3><br/>
                  // Cases: {locationData.cases},<br/>
                  // Cured/Discharged: {locationData.cured_discharged},<br/>
                  // Deaths: {locationData.deaths},<br/>
                  // Helpline: {locationData.helpline}</Tooltip>
                  // :
                  <Popup>
                    <h3 style={{ margin: "0px" }}>{location.district}</h3>
                    Kerala
                    <br />
                    Observation: {locationData.under_observation}
                    Hospitalized: {locationData.total_hospitalised}
                    Home Isolation: {locationData.under_home_isolation}
                    Cases: {locationData.corona_positive}
                    Cured/Discharged: {locationData.cured_discharged}
                    Deaths: {locationData.deaths}
                  </Popup>
                )}
              </Circle>
            );
          })}
        {internationalData.map((location, index) => {
          if (location.country_region === "India") {
            if (countryStats === null) setCountryStats(location);
            return null;
          }
          return (
            <Circle
              key={
                location.province_state
                  ? location.province_state + "." + location.country_region
                  : location.country_region
              }
              center={[location.lat, location.long_]}
              fillColor="#d14f69"
              fillOpacity={0.6}
              stroke={false}
              radius={15000 + findRadius(location.confirmed)}
              onMouseOver={e => {
                e.target.openPopup();
              }}
            >
            {
                (location.recovered) ?
                  <Circle
                    key={location.province_state
                      ? "recovered-"+location.province_state + "." + location.country_region
                      : "recovered-"+location.country_region}
                    center={[location.lat, location.long_]}
                    fillColor="#1df500"
                    fillOpacity={0.7}
                    stroke={false}
                    radius={200 +findRadius(location.recovered)}
                    onMouseOver={e => {
                      e.target.openPopup();
                    }}
                  ></Circle> : null
            }

              {
                (location.deaths) ?
                  <Circle
                    key={location.province_state
                      ? "deaths-" +location.province_state + "." + location.country_region
                      : "deaths-" +location.country_region}
                    center={[location.lat, location.long_]}
                    fillColor="#f55600"
                    fillOpacity={0.8}
                    stroke={false}
                    radius={100 +findRadius(location.deaths)}
                    onMouseOver={e => {
                      e.target.openPopup();
                    }}
                  ></Circle> : null
              }

              <Popup>
                <h3>
                  {location.province_state
                    ? location.province_state
                    : location.country_region}
                </h3>
                {location.province_state && (
                  <span>
                    {location.country_region}
                    <br />
                  </span>
                )}
                    Cases: {location.confirmed}
                    Cured/Discharged: {location.recovered}
                    Deaths: {location.deaths}
                <hr />
                Last Update: {location.last_update}
                <br />
              </Popup>
            </Circle>
          );
        })}
        {viewTestCenters &&
          testCenters.map(testCenter => {
            return (
              <Marker
                key={testCenter.institution}
                position={[testCenter.latitude, testCenter.longitude]}
                onMouseOver={e => {
                  e.target.openPopup();
                }}
              >
                <Popup>
                  <h3>{testCenter.institution}</h3>
                  <a
                    href={
                      "https://www.google.com/maps/search/?api=1&query=" +
                      testCenter.institution +
                      "&query_place_id=" +
                      testCenter.place_id
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Maps
                  </a>
                </Popup>
              </Marker>
            );
          })}
      </Map>
  );
}
