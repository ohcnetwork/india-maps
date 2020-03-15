import React, { Component } from 'react';
import {
  Circle,
  Map,
  Popup,
  TileLayer,
} from 'react-leaflet';
import { readRemoteFile } from 'react-papaparse'
import geoLocation from './geoLocation.js';

const center = [22.9734, 78.6569]
const papaparseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
};
export default class MapContainer extends Component<{}> {
  constructor(){
    super()
    this.state = {
      indiaData: null,
      intData: null,
      countryStats: null,
      worldStats: null
    }
  }
  setInternationalData = (data) => {
    console.log("Setting International Data");
    this.setState({
      intData:data.data
    }, ()=> console.log("International Data:" + JSON.stringify(this.state.intData)))
    this.setState({
      worldStats: data.data.reduce((a,b)=>({confirmed: (a.confirmed + b.confirmed), deaths: (a.deaths + b.deaths), recovered: (a.recovered + b.recovered)}))
    })
  }
  tryYesterday = (date) => {
    date.setDate(date.getDate() - 1);
    const formattedDate = (((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear())
    console.log(formattedDate);
    readRemoteFile('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/'+ formattedDate + '.csv', {
      ...papaparseOptions,
      complete: this.setInternationalData
    })
  }
  componentDidMount() {
    // console.log("Fetching Data")
    fetch("https://exec.clay.run/kunksed/mohfw-covid")
      .then(res => res.json())
      .then(
        (result) => {
          // console.log("Received Response")
          this.setState({
            indiaData: result
          });
        },
        (error) => {
          // console.log("Error Response")
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
    const date = new Date();
    const formattedDate = (((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear())
    console.log(formattedDate);
    readRemoteFile('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/'+ formattedDate + '.csv', {
      ...papaparseOptions,
      complete: this.setInternationalData,
      error: ()=>this.tryYesterday(date)
    })
    // fetch("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/03-14-2020.csv")
    //   .then(res => console.log(readString(res, {
    //
    //   })))
    //   .catch((error) => {
    //       console.log("Error Response" + JSON.stringify(error))
    //     }
    //   )
  }

  render() {
    return (
      <div>
        <Map center={center} zoom={6}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {
            this.state.indiaData && geoLocation.map(location => {
              console.log(location.state + "|" + JSON.stringify(this.state.indiaData.stateData[location.state]))
              const locationData = this.state.indiaData.stateData[location.state];
              if(locationData.cases === 0)
               return null;
              return(
              <Circle key={location.state}
                center={[location.latitude, location.longitude]}
                fillColor="red"
                radius={15000 + (locationData.cases*2500)}
                onMouseOver={(e) => {
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
          }
          {
            Array.isArray(this.state.intData) && this.state.intData.map(location => {
                if(location.country_region === "India"){
                 if(this.state.countryStats === null)
                  this.setState({countryStats: location})
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
        </Map>
        {this.state.indiaData &&
        <div className="information-head" >
          {this.state.countryStats &&<h3> Confirmed Cases: {this.state.countryStats.confirmed > this.state.indiaData.countryData.total ? this.state.countryStats.confirmed : this.state.indiaData.countryData.total } <br/> </h3>}
          {this.state.worldStats &&<h3> Confirmed Cases Worldwide: { this.state.worldStats.confirmed.toLocaleString('en-IN') } <br/> </h3>}
          <h4>
          Total Cases(MoHFS): {this.state.indiaData.countryData.total} <br/>
          Local Patients: {this.state.indiaData.countryData.localTotal} <br/>
          International Patients: {this.state.indiaData.countryData.intTotal} <br/>
          Total Cured/Discharged: {this.state.indiaData.countryData.cured_dischargedTotal} <br/>
          Total Deaths: {this.state.indiaData.countryData.deathsTotal}
          </h4>
          <a href="https://coronasafe.in/" target="_blank"><img src="./coronaSafeLogo.svg" alt="CoronaSafe Logo"/></a>
          Updated Live with data from <br/>
          <a href="https://www.mohfw.gov.in/" target="_blank">Ministry of Health and Family Welfare</a>, India
        </div>}
      </div>
    )
  }
}
