import React, { useState, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import StatWiseList from "./StatWiseList";
import DetailedTile from "./DetailedTile";
import stateGeoLocation from "../../data/geoLocation";
import classNames from "classnames/bind";
const cx = classNames.bind(require("./stateWiseList.module.css"));
export default function IndiaData(props) {
  const { indiaData, onStateSelect, viewTestCenters } = props;
  const isDataLoaded =
    indiaData && Object.keys(indiaData.summary || {}).length > 0;
  const summary = indiaData.summary;
  const stateWiseData = indiaData.regional;
  const handleStateClick = stateData => {
    // filter Map - starts
    let selectedStateCoordinates = stateGeoLocation.filter(
      (aState, index) => aState.state === stateData.loc
    );
    // filter Map - ends
    onStateSelect(stateData, selectedStateCoordinates);
  };
  const handleTestCentersToggle = () => {
    props.onTesteCenterToggle(!viewTestCenters);
  };

  const statByType = { tileList: [], total: 0, styles: [] };
  const initialStatsByType = {death: statByType, active: statByType, recovered: statByType, all: statByType}
  const [indianStatsByType, setIndianStatsByType] = useState(initialStatsByType);
  const [selectedType, setSelectedType] = useState('all');

  // creating categorized state/count/fullData lookup for filtering StateWiseList by each case
  useEffect(() => {
    console.log('indiaData', indiaData)
    if (!indiaData || !indiaData.regional) {
      return;
    }
    const statsByType = {
      death: { 
        tileList: indiaData.regional.filter(d => !!d.deaths)
                                    .map(d => ({state: d.loc, count: d.deaths, stateData: d})),
        total: indiaData.summary.deaths,
        styles: ["case-total", "death-case"] 
      },
      recovered: {
        tileList: indiaData.regional
                    .filter(d => !!d.discharged)
                    .map(d => ({state: d.loc, count: d.discharged, stateData: d})),
        total: indiaData.summary.discharged,
        styles: ["case-total", "recovered-case"] 
      },
      active: {
        tileList: indiaData.regional.filter(d => !!(d.confirmedCasesIndian + d.confirmedCasesForeign))
                                    .map(d => ({state: d.loc, count: d.confirmedCasesIndian + d.confirmedCasesForeign, stateData: d})),
        total: indiaData.summary.total - indiaData.summary.discharged,
        styles: ["case-total", "active-case"] 
      },
      all: {
        tileList: indiaData.regional.map(d => ({ state: d.loc, count: d.confirmedCasesIndian + d.confirmedCasesForeign, stateData: d})),
        total: indiaData.summary.total,
        styles: ["total-confirmed-cases"] 

      }
    };
    setIndianStatsByType(statsByType);
  }, [indiaData])

  const handleCaseTypeClick = caseType => setSelectedType(caseType);
  return (
    <>
      <section className={cx("list-wrapper")}>
        {!isDataLoaded && <div>Loading...</div>}
        {isDataLoaded && (
          <section>
            <div className="switch-text">
              Show test centers
              <label className="switch">
                <input
                  type="checkbox"
                  value={viewTestCenters}
                  onChange={e => handleTestCentersToggle()}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <DetailedTile locationData={indiaData.summary} handleCaseTypeClick={handleCaseTypeClick}/>
            <List component="nav">
              <ListItem button>
                <ListItemText primary="India" />
                <ListItemSecondaryAction className={cx(indianStatsByType[selectedType].styles)}>
                  {indianStatsByType[selectedType].total}{" "}
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            <StatWiseList
              stateWiseData={indianStatsByType[selectedType].tileList}
              onStateClick={handleStateClick}
            />
          </section>
        )}
      </section>
    </>
  );
}
