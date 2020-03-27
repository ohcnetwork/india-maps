import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import classNames from "classnames/bind";
const cx = classNames.bind(require("./stateWiseList.module.css"));

export default function DistrictWiseList(props) {
  const { districtWiseData } = props;
  console.log("DistrictList:" + JSON.stringify(districtWiseData));
  return (
    <>
      <section>
        {districtWiseData && Object.keys(districtWiseData).length > 0 && (
          <List
            component="nav"
            aria-label="district-list"
            className={cx("state-list")}
          >
            {Object.keys(districtWiseData).map((district, i) => {
              if (districtWiseData[district].corona_positive === 0) return null;
              return (
                <ListItem button key={district} className={cx("item-list")}>
                  <ListItemText key={district} primary={district} />
                  <ListItemSecondaryAction>
                    {districtWiseData[district].corona_positive}
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        )}
        {!districtWiseData ||
          (districtWiseData.length === 0 && <div>Loading...</div>)}
      </section>
    </>
  );
}
