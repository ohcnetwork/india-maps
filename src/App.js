import React, {StrictMode} from 'react';
import Map from './Map.js'
import indiaData from './indiaData.json';

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div id="mapid" style={{height: '100vh'}}>
      <Map/>
      <div style={{position:"absolute", background:"white", top:"15px", right:"15px", padding:"20px", zIndex:"100"}}>
        <h4>
        Local Patients: {indiaData.countryData.localTotal} <br/>
        International Patients: {indiaData.countryData.intTotal} <br/>
        Total Cases: {indiaData.countryData.total} <br/>
        Total Cured/Discharged: {indiaData.countryData.cured_dischargedTotal} <br/>
        Total Deaths: {indiaData.countryData.deathsTotal}
        </h4>
      </div>
    </div>
  );
}

export default App;
