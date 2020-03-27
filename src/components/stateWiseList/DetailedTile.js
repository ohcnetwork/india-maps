import React from "react";
import classNames from "classnames/bind";
const cx = classNames.bind(require("./detailedTile.module.css"));
export default function DetailedTile(props) {
const { locationData = {}, handleCaseTypeClick = ()=>{} } = props;
  return (
    <>
      <section>
        <div className={cx("infoTile")}>
          <div className={cx("title")} title="Total Confirmed Cases">
            Total Confirmed Cases
          </div>
<div
            className={cx("confirmed")}
            onClick={() => handleCaseTypeClick("all")}
          >
            {locationData.total + locationData.deaths || 0}
          </div>
          <div className={cx("legend")}>
            <div
              className={cx("legend-icon")}
              style={{ background: "rgb(244, 195, 99)" }}
            ></div>
            <div className={cx("description")}>Active cases</div>
<div className={`${cx(["total", "active-case"])} `} onClick={() => handleCaseTypeClick('active')}>
              {locationData.total - locationData.discharged || 0}
            </div>
            <div
              className={cx("legend-icon")}
              style={{ background: "#108d90" }}
            ></div>
            <div className={cx("description")}>Recovered cases</div>
<div className={`${cx(["total", "recovered-case"])}`} onClick={() => handleCaseTypeClick('recovered')}>
              {locationData.discharged || 0}
            </div>
            <div
              className={cx("legend-icon")}
              style={{ background: "#d14f69" }}
            ></div>
            <div className={cx("description")}>Deaths</div>
<div className={`${cx(["total", "death-case"])}`} onClick={() => handleCaseTypeClick('death')}>
              {locationData.deaths || 0}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
