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
import {groupMetricsByStateAndCountry} from "../utils/DataUtils";

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


export default function MapContainer(props) {
  const {
    setDashboardData,
    setRootData,
    setPan,
    pan
  } = props;

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

  const [mapPan, setMapPan] = useState(pan);

  useEffect(()=>{
    setMapPan(pan)
    console.log("Pan: " + JSON.stringify(pan.geoJson))
  },[pan])

  useEffect(()=>{
    setRootData({data: internationalData})
  },[internationalData])
  useEffect(() => {
    fetch("https://stats.coronasafe.live/covid_data_json/kerala_covid_data.json")
      .then(res => res.json())
      .then(
        result => {
          console.log("Received Response" + result);
          setDistrictData(result);
          }
      );
    
    fetch("https://stats.coronasafe.live/covid_data_json/other_countries_covid_data.json")
      .then(res => res.json())
      .then(
        result => {
          setInternationalData(result.reduce((acc,cur) => {
            return {
              ...acc,
              [cur.Country]:{
                geojson_feature: JSON.parse(cur.geo_json_feature.split("'").join("\"")), 
                confirmed: cur['Confirmed'], 
                deceased: cur['Deaths'],
                recovered: cur['Recovered'], 
                active: cur['Active'],
                latitude: cur['Lat'],
                longitude: cur['Long_']
              }
            }
          },{}));
          }
      );

  }, []);

  const findRadius = cases => {
    return (Math.cbrt(cases)) * 1500
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
  const focusLocation = (latlng) => {
    const [closest,closestData] = findClosest(latlng, internationalData);
    const newGeo = closestData.geojson_feature
    setPan({geoJson:newGeo, location:closest})
    setDashboardData({...closestData, name: closest})
  }
  return (
      <Map 
        className="h-full w-full md:w-4/5 fixed" 
        center={mapPan.position} 
        zoom={mapPan.zoom} 
        minZoom={2}
        maxBounds={[[-85,-180],[85,180]]}
        onClick={e=>{focusLocation(e.latlng)}}
        onMoveend={e=>{focusLocation(e.target.getCenter())}}
      >
        {
          mapPan.geoJson &&
          <GeoJSON
            key={mapPan.location}
            data={mapPan.geoJson}
            style={geoJSONStyle}
            onEachFeature={onEachFeature}
          />
        }
        <TileLayer
          attribution='&amp;copy <a href="https://carto.com">Carto</a>'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        />
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
              />
          )}
        {Object.entries(internationalData).map(([country,location], index) => {
          if (location.country_region === "India") {
            if (countryStats === null) setCountryStats(location);
            return null;
          }
          return (
            <Circle
              key={
                country
              }
              center={{lat: location.latitude, lng: location.longitude}}
              fillColor="#d14f69"
              fillOpacity={0.6}
              stroke={false}
              radius={15000 + findRadius(location.confirmed)}
              onMouseOver={e => {
                e.target.openPopup();
              }}
            >
              <Popup>
                {country}
                {location.confirmed}
                {/* <h3>
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
                <br /> */}
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
