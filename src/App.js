import React, {StrictMode} from 'react';
import Map from './Map.js'
import indiaData from './indiaData.json';

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div id="mapid" style={{height: '100vh'}}>
      <Map/>
    </div>
  );
}

export default App;
