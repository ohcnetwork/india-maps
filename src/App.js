import React from "react";
import Map from "./components/Map.js";
import IndiaData from "./components/stateWiseList/IndiaData";
import SelectedLocationData from "./components/stateWiseList/SelectedLocationData";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import classNames from "classnames/bind";
const cx = classNames.bind(require("./App.module.css"));
function App() {
  const [indiaData, setIndiaData] = React.useState([]);
  const [selectedLocationData, setSelectedLocationData] = React.useState(
    (indiaData || {}).summary || {}
  );
  const [
    selectedLocationDataDispaly,
    setSelectedLocationDataDispaly
  ] = React.useState(false);
  const [newsSearchKeyword, setNewsSearchKeyword] = React.useState("India");
  const handleStateWiseDataSuccess = indiaData => {
    setIndiaData(indiaData);
    setSelectedLocationData(indiaData.summary);
  };
  const handleStateSelect = stateData => {
    setSelectedLocationDataDispaly(
      dimensions.width <= mobileWindowSizeBreakPoint
    );
    setNewsSearchKeyword(stateData.loc);
    setSelectedLocationData(stateData);
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

      return _ => {
        window.removeEventListener("resize", handleResize);
      };
    }
  });
  const handleClose = () => {
    setSelectedLocationDataDispaly(false);
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
            <Dialog onClose={handleClose} open={selectedLocationDataDispaly}>
              <DialogTitle id="customized-dialog-title" onClose={handleClose}>
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

          <div className={cx("map-wrapper")}>
            <Map onStateWiseDataGetSuccess={handleStateWiseDataSuccess} />
          </div>
        </section>
      </section>
    </>
  );
}

export default App;
