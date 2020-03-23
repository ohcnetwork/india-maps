import React from "react";
import classNames from "classnames/bind";
const cx = classNames.bind(require("./detailedTile.module.css"));
export default function DetailedTile(props) {
  const { locationData = {} } = props;
  return (
    <>
      <section>
        <div className={cx("infoTile")}>
          <div className={cx("title")} title="Total Confirmed Cases">
            Total Confirmed Cases
          </div>
          <div className={cx("confirmed")}>{locationData.total || 0}</div>
          <div className={cx("legend")}>
            <div
              className={cx("legend-icon")}
              style={{ background: "rgb(244, 195, 99)" }}
            ></div>
            <div className={cx("description")}>Active cases</div>
            <div className={`${cx("total")} ${cx("active-case")} `}>
              {locationData.total - locationData.discharged || 0}
            </div>
            <div
              className={cx("legend-icon")}
              style={{ background: "rgb(96, 187, 105)" }}
            ></div>
            <div className={cx("description")}>Recovered cases</div>
            <div className={`${cx("total")} ${cx("recovered-case")}`}>
              {locationData.discharged || 0}
            </div>
            <div
              className={cx("legend-icon")}
              style={{ background: "rgb(118, 118, 118)" }}
            ></div>
            <div className={cx("description")}>Deaths</div>
            <div className={`${cx("total")} ${cx("death-case")}`}>
              {locationData.deaths || 0}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
