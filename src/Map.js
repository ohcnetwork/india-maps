import React, { Component } from 'react';
import {
  Circle,
  CircleMarker,
  Map,
  Polygon,
  Polyline,
  Popup,
  Rectangle,
  TileLayer,
} from 'react-leaflet';
import geoLocation from './geoLocation.js';
import logo from './logo.svg';
import './App.css';

const center = [22.9734, 78.6569]

export default class MapContainer extends Component<{}> {
  constructor(){
    super()
    this.state = {
      indiaData: null
    }
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
  }

  render() {
    return (
      <div>
        <Map center={center} zoom={5}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.state.indiaData && geoLocation.map(location => {
            console.log(location.state + "|" + JSON.stringify(this.state.indiaData.stateData[location.state]))
            const locationData = this.state.indiaData.stateData[location.state];
            if(locationData.cases === 0)
             return null;
            return(
            <Circle key={location.state} center={[location.latitude, location.longitude]} fillColor="blue" radius={10000 + (locationData.cases*2500)}>
              <Popup>
              <h3>{location.state}</h3><br/>
              Cases: {locationData.cases},<br/>
              Cured/Discharged: {locationData.cured_discharged},<br/>
              Deaths: {locationData.deaths},<br/>
              Helpline: {locationData.helpline}</Popup>
            </Circle>)
          }

          )}
        </Map>
        {this.state.indiaData &&
        <div style={{position:"absolute", background:"white", top:"15px", right:"15px", padding:"20px", zIndex:"100"}}>
          <h4>
          Total Cases: {this.state.indiaData.countryData.total} <br/>
          Local Patients: {this.state.indiaData.countryData.localTotal} <br/>
          International Patients: {this.state.indiaData.countryData.intTotal} <br/>
          Total Cured/Discharged: {this.state.indiaData.countryData.cured_dischargedTotal} <br/>
          Total Deaths: {this.state.indiaData.countryData.deathsTotal}
          </h4>
          <img src="./coronaSafeLogo.svg" alt="CoronaSafe Logo"/>
        </div>}
      </div>
    )
  }
}
