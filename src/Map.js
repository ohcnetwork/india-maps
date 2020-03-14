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
import indiaData from './indiaData.json';
import logo from './logo.svg';
import './App.css';

const center = [22.9734, 78.6569]

export default class MapContainer extends Component<{}> {
  render() {
    return (
      <Map center={center} zoom={5}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoLocation.map(location => {
          console.log(location.state + "|" + JSON.stringify(indiaData.stateData[location.state]))
          const locationData = indiaData.stateData[location.state];
          if(locationData.cases === 0)
           return null;
          return(
          <Circle key={location.state} center={[location.latitude, location.longitude]} fillColor="blue" radius={8000*locationData.cases}>
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
    )
  }
}
