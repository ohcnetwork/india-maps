import React, { useState, useEffect } from 'react';
import {
  Circle,
  Map,
  Marker,
  Popup,
  Tooltip,
  TileLayer,
} from 'react-leaflet';
import { readRemoteFile } from 'react-papaparse'
import geoLocation from '../data/geoLocation.js';
import testCenters from '../data/testCenters.js';

const center = [15.398610, 77.563477]
const papaparseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
};
export default function MapContainer() {
  const[indiaData, setIndiaData] = useState(null);
  const[internationalData, setInternationalData] = useState(null);
  const[countryStats, setCountryStats] = useState(null);
  const[worldStats, setWorldStats] = useState(null);

  const[viewTestCenters, setViewTestCenters] = useState(false);
  const[firstLoad, setFirstLoad] = useState(true);

  const parseInternationalData = (data) => {
    // console.log("Setting International Data");
    // console.log("International Data:" + JSON.stringify(data.data))
    setInternationalData(data.data)
    setWorldStats(data.data.reduce((a,b)=>({confirmed: (a.confirmed + b.confirmed), deaths: (a.deaths + b.deaths), recovered: (a.recovered + b.recovered)})))
  }
  const tryYesterday = (date) => {
    date.setDate(date.getDate() - 1);
    const formattedDate = (((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear())
    // console.log(formattedDate);
    readRemoteFile('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/'+ formattedDate + '.csv', {
      ...papaparseOptions,
      complete: parseInternationalData,
      error: ()=>tryYesterday(date)
    })
  }
  useEffect(()=>{
    // console.log("Fetching Data")
    fetch("https://exec.clay.run/kunksed/mohfw-covid")
      .then(res => res.json())
      .then(
        (result) => {
          // console.log("Received Response")
          setIndiaData(result)
        },
        (error) => {
          // console.log("Error Response")
        }
      )
    const date = new Date();
    const formattedDate = (((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear())
    // console.log(formattedDate);
    readRemoteFile('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/'+ formattedDate + '.csv', {
      ...papaparseOptions,
      complete: parseInternationalData,
      error: ()=>tryYesterday(date)
    })
  },[])
    console.log(viewTestCenters);

    return (
      <div>
        <Map center={center} zoom={5}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {
            indiaData && geoLocation.map(location => {
              // console.log(location.state + "|" + JSON.stringify(indiaData.stateData[location.state]))
              const locationData = indiaData.stateData[location.state];
              if(locationData.cases === 0)
               return null;
              return(
              <Circle key={location.state}
                center={[location.latitude, location.longitude]}
                fillColor="red"
                radius={15000 + (locationData.cases*2500)}
                onMouseOver={(e) => {
                  firstLoad && setFirstLoad(false)
                  e.target.openPopup();
                }}>

                { location.state === "Kerala" && firstLoad ?
                    <Tooltip permanent>
                    <h3>{location.state}</h3><br/>
                    Cases: {locationData.cases},<br/>
                    Cured/Discharged: {locationData.cured_discharged},<br/>
                    Deaths: {locationData.deaths},<br/>
                    Helpline: {locationData.helpline}</Tooltip>
                  :
                    <Popup>
                    <h3>{location.state}</h3><br/>
                    Cases: {locationData.cases},<br/>
                    Cured/Discharged: {locationData.cured_discharged},<br/>
                    Deaths: {locationData.deaths},<br/>
                    Helpline: {locationData.helpline}</Popup>
                }
              </Circle>)
            })
          }
          {
            Array.isArray(internationalData) && internationalData.map(location => {
                if(location.country_region === "India"){
                 if(countryStats === null)
                  setCountryStats(location)
                 return null;
                }
              return(
              <Circle
                key={location.province_state ? (location.province_state + "." +  location.country_region) : location.country_region}
                center={[location.latitude, location.longitude]}
                fillColor="red"
                radius={15000 + (location.confirmed*20)}
                onMouseOver={(e) => {
                  e.target.openPopup();
                }}>

                <Popup>
                <h3>{location.province_state ? location.province_state : location.country_region}</h3>
                {location.province_state && <span>{location.country_region}<br/></span>}
                Cases: {location.confirmed},<br/>
                Cured/Discharged: {location.recovered},<br/>
                Deaths: {location.deaths},<br/>
              Last Update: {location.last_update}<br/></Popup>
              </Circle>)
            })
          }
          {
            viewTestCenters && testCenters.map(testCenter => {
              return(
              <Marker
                key={testCenter.institution}
                position={[testCenter.latitude, testCenter.longitude]}
                onMouseOver={(e) => {
                  e.target.openPopup();
                }}>

                <Popup>
                <h3>{testCenter.institution}</h3>
                <a href={"https://www.google.com/maps/search/?api=1&query="+ testCenter.institution +"&query_place_id=" + testCenter.place_id} target="_blank" rel="noopener noreferrer">Open in Maps</a>
                </Popup>
              </Marker>)
            })
          }
        </Map>
        {indiaData &&
        <div className="information-head" >
          <span className="switch-text">Test Centers</span>
          <label className="switch">
            <input type="checkbox" value={viewTestCenters} onChange={(e)=>setViewTestCenters(!viewTestCenters)} />
            <span className="slider round"></span>
          </label>
          <span className="switch-text"></span>

          {countryStats &&<h3> Confirmed Cases: {countryStats.confirmed > indiaData.countryData.total ? countryStats.confirmed : indiaData.countryData.total } <br/> </h3>}
          {worldStats &&<h3> Confirmed Cases Worldwide: { worldStats.confirmed.toLocaleString('en-IN') } <br/> </h3>}
          <h4>
          Total Cases(MoHFS): {indiaData.countryData.total} <br/>
          Local Patients: {indiaData.countryData.localTotal} <br/>
          International Patients: {indiaData.countryData.intTotal} <br/>
          Total Cured/Discharged: {indiaData.countryData.cured_dischargedTotal} <br/>
          Total Deaths: {indiaData.countryData.deathsTotal}
          </h4>
          <a href="https://coronasafe.in/" target="_blank" rel="noopener noreferrer" ><img src="./coronaSafeLogo.svg" alt="CoronaSafe Logo"/></a>
          Updated Live with data from <br/>
          <a href="https://www.mohfw.gov.in/" target="_blank" rel="noopener noreferrer" >Ministry of Health and Family Welfare</a>, India
        </div>}
      </div>
    )
}
