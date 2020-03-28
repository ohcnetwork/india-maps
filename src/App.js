import React, { Component } from "react";
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indiaData: [],
      districtData: {},
      selectedLocationData: {
        summary: {}
      },
      selectedLocCoordinate: [],
      selectedLocationDataDisplay: false,
      newsSearchKeyword: "India",
      showTestCenters: false,
      dimensions: {
        height: window.innerHeight,
        width: window.innerWidth
      },
      showLeftNav: true
    };
  }

  mobileWindowSizeBreakPoint = 767;

  handleStateWiseDataSuccess = indiaData => {
    this.setState({
      indiaData: indiaData,
      selectedLocationData: {
        summary: indiaData.summary
      }
    });
  };

  handleStateSelect = (stateData, selectedLocationCoordinate) => {
    let selectedLocationData = {
      summary: stateData
    };
    this.setState({
      selectedLocCoordinate: selectedLocationCoordinate,
      selectedLocationDataDisplay:
        this.state.dimensions.width <= this.mobileWindowSizeBreakPoint,
      newsSearchKeyword: stateData.loc,
      selectedLocationData: { ...selectedLocationData }
    });
  };

  handleResize = _ => {
    let dimension = {
      height: window.innerHeight,
      width: window.innerWidth
    };
    this.setState({
      dimensions: {
        ...dimension
      }
    });
  };

  handleClose = _ => {
    this.setState({
      selectedLocationDataDisplay: false
    });
  };

  handleTestCenterToggle = showTestCenters => {
    this.setState({
      showTestCenters: !!showTestCenters
    });
  };

  toggleLeftNav = value => {
    this.setState({
      showLeftNav: !this.state.showLeftNav
    });
  };

  componentDidMount = _ => {
    window.addEventListener("resize", this.handleResize);
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.handleResize);
  };

  render() {
    let {
      indiaData,
      showTestCenters,
      dimensions,
      selectedLocationData,
      newsSearchKeyword,
      selectedLocationDataDisplay,
      selectedLocCoordinate
    } = this.state;
    return (
      <>
        <section className={cx("app-wrapper")}>
          <section className={cx("app-container")}>
            <div className={cx("map-wrapper")}>
              <Map
                onStateWiseDataGetSuccess={this.handleStateWiseDataSuccess}
                onDistrictWiseDataGetSuccess={
                  this.handleDistrictWiseDataSuccess
                }
                viewTestCenters={showTestCenters}
                selectedLocCoordinate={selectedLocCoordinate}
              />
            </div>

            <div
              className={`${cx("left-panel")} ${
                this.state.showLeftNav ? "show" : cx("hide")
              }`}
            >
              <AppHeader />
              <div className={cx("tracker-list-container")}>
                <div className={cx("list-wrapper")}>
                  <IndiaData
                    indiaData={indiaData}
                    onStateSelect={this.handleStateSelect}
                    onTestCenterToggle={this.handleTestCenterToggle}
                    viewTestCenters={showTestCenters}
                  />
                </div>
                {dimensions.width > this.mobileWindowSizeBreakPoint && (
                  <>
                    <div className={cx("new-wrapper")}>
                      <SelectedLocationData
                        locationData={{
                          ...selectedLocationData,
                          loc: newsSearchKeyword
                        }}
                      />
                    </div>
                    <span
                      className={cx("toggle-button")}
                      onClick={this.toggleLeftNav}
                    >
                      {this.state.showLeftNav ? "Close" : "Open"}
                    </span>
                  </>
                )}
                {dimensions.width <= this.mobileWindowSizeBreakPoint && (
                  <Dialog
                    onClose={this.handleClose}
                    open={selectedLocationDataDisplay}
                    fullWidth={true}
                    className={`${cx("customized-dialog-wrapper")}`}
                  >
                    {/* <DialogTitle
                      id="customized-dialog-title"
                      onClose={this.handleClose}
                      className="customized-dialog-title"
                    >
                      
                    </DialogTitle> */}
                    {/* {selectedLocationData.loc} */}
                    <IconButton
                      aria-label="close"
                      onClick={this.handleClose}
                      style={{ float: "right" }}
                      className={`${cx("close-button")}`}
                    >
                      X
                    </IconButton>
                    <div className={`${cx("new-wrapper")} ${cx("test")}`}>
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
          </section>
        </section>
      </>
    );
  }
}

export default App;
