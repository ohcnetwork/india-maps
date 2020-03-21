import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import StatWiseList from "./StatWiseList";
import DetailedTile from "./DetailedTile";
import classNames from "classnames/bind";
const cx = classNames.bind(require("./stateWiseList.module.css"));
export default function StateWiseList(props) {
  const { indiaData, onStateSelect, viewTestCenters } = props;
  const isDataLoaded =
    indiaData && Object.keys(indiaData.summary || {}).length > 0;
  const summary = indiaData.summary;
  const stateWiseData = indiaData.regional;
  const handleStateClick = stateData => {
    onStateSelect(stateData);
  };
  const handleTestCentersToggle = () => {
    props.onTesteCenterToggle(!viewTestCenters);
  };
  return (
    <>
      <section className={cx("list-wrapper")}>
        {!isDataLoaded && <div>Loading...</div>}
        {isDataLoaded && (
          <section>
            <div className="switch-text">
              Test Centers
              <label className="switch">
                <input
                  type="checkbox"
                  value={viewTestCenters}
                  onChange={e => handleTestCentersToggle()}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <DetailedTile locationData={indiaData.summary} />
            <List component="nav">
              <ListItem button>
                <ListItemText primary="India" />
                <ListItemSecondaryAction>
                  {summary.total}{" "}
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            <StatWiseList
              stateWiseData={stateWiseData}
              onStateClick={handleStateClick}
            />
          </section>
        )}
      </section>
    </>
  );
}
