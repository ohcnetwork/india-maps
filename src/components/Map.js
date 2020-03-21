import React, { useState, useEffect } from 'react';
import {
  Circle,
  Map,
  Marker,
  Popup,
  // Tooltip,
  TileLayer,
} from 'react-leaflet';
import { readRemoteFile } from 'react-papaparse'
import geoLocation from '../data/geoLocation.js';
import districtGeoLocation from '../data/districtGeoLocation.js';
import testCenters from '../data/testCenters.js';

const center = [9.5915668, 76.5221531]
const papaparseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
};
export default function MapContainer() {
  const[indiaData, setIndiaData] = useState(null);

  const[stateData, setStateData] = useState(null);
  const[countrySummary, setCountrySummary] = useState(null);

  const[districtData, setDistrictData] = useState(null);

  const[internationalData, setInternationalData] = useState(null);
  const[countryStats, setCountryStats] = useState(null);
  const[worldStats, setWorldStats] = useState(null);

  const[viewTestCenters, setViewTestCenters] = useState(false);
  const[showInfoHead, setShowInfoHead] = useState(true);
  const[firstLoad, setFirstLoad] = useState(true);

  const parseInternationalData = (data) => {
    // console.log("Setting International Data");
    // console.log("International Data:" + JSON.stringify(data.data))
    setInternationalData(data.data)
    setWorldStats(data.data.reduce((a,b)=>({confirmed: (a.confirmed + b.confirmed), deaths: (a.deaths + b.deaths), recovered: (a.recovered + b.recovered)})))
  }
  useEffect(()=>{
    if(countrySummary)
      if(indiaData.countryData)
        if((countrySummary.confirmedCasesIndian + countrySummary.confirmedCasesForeign) > indiaData.countryData.total)
          setIndiaData(null);
  },[stateData,indiaData])
  useEffect(()=>{
    console.log("Fetching Data")
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
    fetch("https://volunteer.coronasafe.network/api/reports")
      .then(res => res.json())
      .then(
        (result) => {
          console.log("Received Response" + result)
          setDistrictData(result)
        },
        (error) => {
          console.log("Error Response")
        }
      )

    fetch("https://api.rootnet.in/covid19-in/stats/latest")
      .then(res => res.json())
      .then(
        (result) => {
          console.log("Received Response" + result)
          setStateData(Object.assign({}, ...result.data.regional.map(({loc, confirmedCasesIndian, confirmedCasesForeign, deaths, discharged}) => ({[loc]: {confirmedCasesIndian, confirmedCasesForeign, deaths, discharged}}))))
          setCountrySummary(result.data.summary)
        },
        (error) => {
          console.log("Error Response")
        }
      )


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
        <Map center={center} zoom={7}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
          />
        {
            indiaData && indiaData.stateData ? geoLocation.map(location => {
              console.log(location.state + "|" + JSON.stringify(indiaData.stateData[location.state]))
              const locationData = indiaData.stateData[location.state];
              if(locationData.cases === 0 || location.state === "Kerala")
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
                    <Popup>
                    <h3>{location.state}</h3><br/>
                    Cases: {locationData.cases},<br/>
                    Cured/Discharged: {locationData.cured_discharged},<br/>
                    Deaths: {locationData.deaths},<br/>
                    Helpline: {locationData.helpline}</Popup>
              </Circle>)
            })

            : stateData && geoLocation.map(location => {
              // console.log(location.state + "|" + JSON.stringify(indiaData.stateData[location.state]))
              const locationData = stateData[location.state];
              if(locationData === undefined || (locationData.confirmedCasesIndian === 0 && locationData.confirmedCasesForeign === 0) || location.state === "Kerala")
               return null;
              return(
              <Circle key={location.state}
                center={[location.latitude, location.longitude]}
                fillColor="red"
                radius={15000 + ((locationData.confirmedCasesIndian + locationData.confirmedCasesForeign)*2500)}
                onMouseOver={(e) => {
                  firstLoad && setFirstLoad(false)
                  e.target.openPopup();
                }}>
                    <Popup>
                    <h3>{location.state}</h3><br/>
                    Cases: {locationData.confirmedCasesIndian + locationData.confirmedCasesForeign},<br/>
                    Cured/Discharged: {locationData.discharged},<br/>
                    Deaths: {locationData.deaths}</Popup>
              </Circle>)
            })
          }
          {
            districtData && districtGeoLocation.map(location => {
              // console.log(location.state + "|" + JSON.stringify(indiaData.stateData[location.state]))
              const locationData = districtData.kerala[location.district];
              if(locationData === undefined || locationData.corona_positive === 0)
               return null;
              return(
              <Circle key={location.district}
                center={[location.latitude, location.longitude]}
                fillColor="red"
                radius={15000 + (locationData.corona_positive*2500)}
                onMouseOver={(e) => {
                  firstLoad && setFirstLoad(false)
                  e.target.openPopup();
                }}>

                { location.state !== "Kerala" &&
                  // firstLoad ?
                    // <Tooltip permanent>
                    // <h3>{location.state}</h3><br/>
                    // Cases: {locationData.cases},<br/>
                    // Cured/Discharged: {locationData.cured_discharged},<br/>
                    // Deaths: {locationData.deaths},<br/>
                    // Helpline: {locationData.helpline}</Tooltip>
                  // :
                  <Popup>
                  <h3 style={{margin:"0px"}}>{location.district}</h3>
                  Kerala<br/>
                  <p>
                  Under Observation: {locationData.under_observation},<br/>
                  Total Hospitalized: {locationData.total_hospitalised},<br/>
                  Under Home Isolation: {locationData.under_home_isolation},<br/>
                  Cases: {locationData.corona_positive},<br/>
                  Cured/Discharged: {locationData.cured_discharged},<br/>
                  Deaths: {locationData.deaths}</p></Popup>
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
        {showInfoHead && countrySummary &&
        <div className="information-head" >
          <a href="#" className="button3" onClick={e=>{e.preventDefault(); setShowInfoHead(false)}}>Hide Info</a>
          <div className="switch-text">Test Centers
          <label className="switch">
            <input type="checkbox" value={viewTestCenters} onChange={(e)=>setViewTestCenters(!viewTestCenters)} />
            <span className="slider round"></span>
          </label>
          </div>
          {(indiaData && indiaData.stateData) ?
            <React.Fragment>
              {indiaData && <h3> Confirmed Cases: {countryStats.confirmed > indiaData.countryData.total ? countryStats.confirmed : indiaData.countryData.total } <br/> </h3>}
              {worldStats && <h3> Confirmed Cases Worldwide: { worldStats.confirmed.toLocaleString('en-IN') } <br/> </h3>}
              <h4>
                Total Cases(MoHFS): {indiaData.countryData.total} <br/>
                Local Patients: {indiaData.countryData.localTotal} <br/>
                International Patients: {indiaData.countryData.intTotal} <br/>
                Total Cured/Discharged: {indiaData.countryData.cured_dischargedTotal} <br/>
                Total Deaths: {indiaData.countryData.deathsTotal}
              </h4>
            </React.Fragment>
         :  <React.Fragment>
              {countryStats &&<h3> Confirmed Cases: {countryStats.confirmed > countrySummary.total ? countryStats.confirmed : countrySummary.total } <br/> </h3>}
              {worldStats &&<h3> Confirmed Cases Worldwide: { worldStats.confirmed.toLocaleString('en-IN') } <br/> </h3>}
              <h4>
                Local Patients: {countrySummary.confirmedCasesIndian} <br/>
                International Patients: {countrySummary.confirmedCasesForeign} <br/>
                Total Cured/Discharged: {countrySummary.discharged} <br/>
                Total Deaths: {countrySummary.deaths}
              </h4>
            </React.Fragment>}
          <a href="https://coronasafe.in/" target="_blank" rel="noopener noreferrer" ><img src="./coronaSafeLogo.svg" alt="CoronaSafe Logo"/></a>
          Updated Live with data from <br/>
          <a href="https://www.mohfw.gov.in/" target="_blank" rel="noopener noreferrer" >Ministry of Health and Family Welfare</a>, India<br/>
          Mapped using <a href="https://openstreetmap.org/" target="_blank" rel="noopener noreferrer" >OpenStreetMap.org</a>
        </div>}
        {!showInfoHead &&
        <div className="information-head">
          <a href="#" className="button3" onClick={e=>{e.preventDefault(); setShowInfoHead(true)}}>Show Info</a>
        </div>}
      </div>
    )
}
