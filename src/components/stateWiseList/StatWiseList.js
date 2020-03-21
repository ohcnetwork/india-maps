import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import classNames from "classnames/bind";
const cx = classNames.bind(require("./stateWiseList.module.css"));

export default function StateWiseList(props) {
  const { stateWiseData } = props;
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const handleListItemClick = (stateData, selectedIndex) => {
    setSelectedIndex(selectedIndex);
    props.onStateClick(stateData);
  };
  return (
    <>
      <section>
        {stateWiseData && stateWiseData.length > 0 && (
          <List
            component="nav"
            aria-label="secondary mailbox folders"
            className={cx("state-list")}
          >
            {stateWiseData.map((stateData, i) => {
              return (
                <ListItem
                  button
                  key={stateData.loc}
                  className={cx("item-list")}
                  onClick={event => handleListItemClick(stateData, i)}
                  selected={selectedIndex === i}
                >
                  <ListItemText key={stateData.loc} primary={stateData.loc} />
                  <ListItemSecondaryAction>
                    {stateData.confirmedCasesIndian +
                      stateData.confirmedCasesForeign}
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        )}
        {!stateWiseData ||
          (stateWiseData.length === 0 && <div>Loading...</div>)}
      </section>
    </>
  );
}
