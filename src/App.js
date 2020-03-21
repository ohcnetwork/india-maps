import React from "react";
import Map from "./components/Map.js";
import IndiaData from "./components/stateWiseList/IndiaData";
import SelectedLocationData from "./components/stateWiseList/SelectedLocationData";
import classNames from "classnames/bind";
const cx = classNames.bind(require("./App.module.css"));
function App() {
  const [indiaData, setIndiaData] = React.useState([]);
  const [selectedLocationData, setSelectedLocationData] = React.useState(
    (indiaData || {}).summary || {}
  );
  const [newsSearchKeyword, setNewsSearchKeyword] = React.useState("India");
  const handleStateWiseDataSuccess = indiaData => {
    setIndiaData(indiaData);
    setSelectedLocationData(indiaData.summary);
  };
  const handleStateSelect = stateData => {
    setNewsSearchKeyword(stateData.loc);
    setSelectedLocationData(stateData);
  };
  return (
    <>
      <section className={cx("app-wrapper")}>
        <section className={cx("app-container")}>
          <div className={cx("list-wrapper")}>
            <h1>COVID-19 India Tracker</h1>
            <IndiaData
              indiaData={indiaData}
              onStateSelect={handleStateSelect}
            />
          </div>
          <div className={cx("new-wrapper")}>
            <SelectedLocationData
              locationData={{ ...selectedLocationData, loc: newsSearchKeyword }}
            />
          </div>
          <div className={cx("map-wrapper")}>
            <Map onStateWiseDataGetSuccess={handleStateWiseDataSuccess} />
          </div>
        </section>
      </section>
    </>
  );
}

export default App;
