import React, { useState, useEffect, useRef } from "react";
import {
  Circle,
  GeoJSON,
  Map,
  Marker,
  Popup,
  // Tooltip,
  TileLayer
} from "react-leaflet";
import { readRemoteFile } from "react-papaparse";
import {formattedDate} from "../utils/DateUtil";
import {findClosest} from "../utils/LocationUtils";

import geoLocation from "../data/geoLocation.js";
import districtGeoLocation from "../data/kerala_district.geo.json";
import testCenters from "../data/testCenters.js";
import geoData from "../data/kashmir.geo.json";

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
    selectedLocCoordinate,
    setDashboardData
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

  const [viewTestCenters, setViewTestCenters] = useState(false);
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
    fetch("https://raw.githubusercontent.com/coronasafe/geo-stats/master/Kerala_Covid_Cordinate_Data.json")
      .then(res => res.json())
      .then(
        result => {
          console.log("Received Response" + result);
          setDistrictData(result);
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
      date.setDate(date.getDate() - 1)
      const yesterday=formattedDate(date);
      readRemoteFile(
        "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/" +
        yesterday +
        ".csv",
        {
          ...papaparseOptions,
          complete: parseInternationalData,
          error: () => tryYesterday(date)
        }
      );
    };
    const date = new Date();
    readRemoteFile(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/" +
      formattedDate(date) +
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
  const [center,setCenter] = useState({
    hasLocation: false,
    latlng: {
      lat: 9.5915668,
      lng: 76.5221531
    }})
  const mapRef = useRef(null);
  const handleClick = () => {
    const map = mapRef.current
    if (map != null) {
      map.leafletElement.locate()
    }
  }

  const geoJSONStyle = (feature) => {return {
    color: '#FFFFFF',
    weight: 1,
    fillOpacity: 0.5,
    fillColor: '#A73829',
  }}
  const renderTooltip = (feature) => {
    return `Details Unavailable`
  }
  const onEachFeature = (feature, layer) => {
    const tooltipChildren = renderTooltip(feature);
    const popupContent = `<Popup> ${tooltipChildren} </Popup>`
    layer.bindPopup(popupContent)
  }
  const handleLocationFound = (e) => {
    setCenter({
      hasLocation: true,
      latlng: e.latlng,
    })
  }
  const focusLocation = (latlng) => {
    const [closest,closestData] = findClosest(latlng, districtData.data);
    const newGeo=districtGeoLocation.features.find(feature => feature.properties[districtData.geo_json_id]===closest);
    console.log(newGeo)
    setGeoJSON(newGeo)
    setDashboardData(closestData)
  }
  const marker = center.hasLocation ? (
    <Marker position={center.latlng}>
      <Popup>You are here</Popup>
    </Marker>
  ) : null
  const [geoJSON, setGeoJSON] = useState();
  return (
      <Map 
        className="h-screen w-full fixed" 
        center={center.latlng} 
        zoom={7} 
        ref={mapRef}
        minZoom={3} 
        maxBounds={[[90,-270],[-90,-270],[90,360],[-90,360]]}
        onClick={e=>{focusLocation(e.latlng)}}
        onMoveend={e=>{focusLocation(e.target.getCenter())}}
      >
        {
          geoJSON &&
          <GeoJSON
            key={geoJSON.properties[districtData.geo_json_id]}
            data={geoJSON}
            style={geoJSONStyle}
            onEachFeature={onEachFeature}
          />}

        {marker}
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
          Object.entries(districtData.data).map(([location,data]) =>
            // console.log(location.state + "|" + JSON.stringify(indiaData.stateData[location.state]))
              <Circle
                key={location}
                center={[data.latitude, data.longitude]}
                fillColor="#d14f69"
                fillOpacity={0.6}
                stroke={false}
                radius={15000 + findRadius(data.active)}
                onMouseOver={e => {
                  firstLoad && setFirstLoad(false);
                  e.target.openPopup();
                }}
              >
                  <Popup>
                    <h3 style={{ margin: "0px" }}>{location}</h3>
                    Kerala
                    <br />
                    Observation: {data.total_obs}
                    Hospitalized: {data.hospital_obs}
                    Home Isolation: {data.home_obs}
                    Cases: {data.confirmed}
                    Cured/Discharged: {data.recovered}
                    Deaths: {data.deceased}
                  </Popup>
              </Circle>
          )}
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
