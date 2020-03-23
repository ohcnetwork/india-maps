import React from "react";
import Map from "./components/Map.js";
import IndiaData from "./components/stateWiseList/IndiaData";
import SelectedLocationData from "./components/stateWiseList/SelectedLocationData";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import classNames from "classnames/bind";
import AppHeader from "./components/appHeader/AppHeader";
import AppFooter from "./components/appFooter/AppFooter";
const cx = classNames.bind(require("./App.module.css"));
function App() {
  const [indiaData, setIndiaData] = React.useState([]);
  const [districtData, setDistrictData] = React.useState({});
  const [selectedLocationData, setSelectedLocationData] = React.useState({
    summary: (indiaData || {}).summary || {}
  });
  const [selectedLocCoordinate, setSelectedLocCoordinate] = React.useState([]);
  const [
    selectedLocationDataDispaly,
    setSelectedLocationDataDispaly
  ] = React.useState(false);
  const [newsSearchKeyword, setNewsSearchKeyword] = React.useState("India");
  const [showTestCenters, setShowTestCenters] = React.useState(false);
  const handleStateWiseDataSuccess = indiaData => {
    setIndiaData(indiaData);
    setSelectedLocationData({ summary: indiaData.summary });
  };
  const handleDistrictWiseDataSuccess = data => {
    setDistrictData(data);
  };

  const handleStateSelect = (stateData, selectedLocationCoordinate) => {
    setSelectedLocCoordinate(selectedLocationCoordinate);
    setSelectedLocationDataDispaly(
      dimensions.width <= mobileWindowSizeBreakPoint
    );
    setNewsSearchKeyword(stateData.loc);
    setSelectedLocationData({
      summary: stateData,
      subLocations: districtData[stateData.loc.toLowerCase()]
    });
  };

  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth
  });
  const mobileWindowSizeBreakPoint = 767;
  React.useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  });
  const handleClose = () => {
    setSelectedLocationDataDispaly(false);
  };
  const handleTesteCenterToggle = showTestCenters => {
    setShowTestCenters(!!showTestCenters);
  };
  return (
    <>
      <section className={cx("app-wrapper")}>
        <section className={cx("app-container")}>
          <div className={cx("left-panel")}>
            <AppHeader />
            <div className={cx("tracker-list-container")}>
              <div className={cx("list-wrapper")}>
                {/* <h1>COVID-19 India Tracker</h1> */}
                <IndiaData
                  indiaData={indiaData}
                  onStateSelect={handleStateSelect}
                  onTesteCenterToggle={handleTesteCenterToggle}
                  viewTestCenters={showTestCenters}
                />
              </div>
              {dimensions.width > mobileWindowSizeBreakPoint && (
                <div className={cx("new-wrapper")}>
                  <SelectedLocationData
                    locationData={{
                      ...selectedLocationData,
                      loc: newsSearchKeyword
                    }}
                  />
                </div>
              )}
              {dimensions.width <= mobileWindowSizeBreakPoint && (
                <Dialog
                  onClose={handleClose}
                  open={selectedLocationDataDispaly}
                >
                  <DialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                  >
                    {selectedLocationData.loc}
                    <IconButton
                      aria-label="close"
                      onClick={handleClose}
                      style={{ float: "right" }}
                    >
                      X
                    </IconButton>
                  </DialogTitle>
                  <div className={cx("new-wrapper")}>
                    <SelectedLocationData
                      locationData={{
                        ...selectedLocationData,
                        loc: newsSearchKeyword
                      }}
                    />
                  </div>
                </Dialog>
              )}
            </div>
            <AppFooter></AppFooter>
          </div>

          <div className={cx("map-wrapper")}>
            <Map
              onStateWiseDataGetSuccess={handleStateWiseDataSuccess}
              onDistrictWiseDataGetSuccess={handleDistrictWiseDataSuccess}
              viewTestCenters={showTestCenters}
              selectedLocCoordinate={selectedLocCoordinate}
            />
          </div>
        </section>
      </section>
    </>
  );
}

export default App;
