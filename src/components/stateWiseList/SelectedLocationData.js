import React, { Component } from "react";
import NewsCard from "./NewsCard";
import DetailedTile from "./DetailedTile";
import DistrictWiseList from "./DistrictWiseList";
import Chart from "../Chart";
import classNames from "classnames/bind";
const cx = classNames.bind(require("./stateWiseList.module.css"));
export default class SelectedLocationData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      news: []
    };
  }

  componentDidMount() {
    // fetch(
    //   `https://newsapi.org/v2/everything?q=coronavirus ${this.props.locationData.loc}&api=news&count=5&sortBy=publishedAt&apiKey=542dde4c96ed4664a7d652b9730c635c`
    // )
    //   .then(res => res.json())
    //   .then(
    //     result => {
    //       this.setState({
    //         news: result.articles || []
    //       });
    //     },
    //     error => {
    //       this.setState({
    //         news: [],
    //         error
    //       });
    //     }
    //   );
  }

  render() {
    const { locationData } = this.props;
    const isDataLoaded =
      locationData && Object.keys(locationData || {}).length > 0;
    const { error, news } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else {
      return (
        <>
          <section className={cx("list-wrapper")}>
            {!isDataLoaded && <div>Loading...</div>}
            {isDataLoaded && (
              <section>
                <h1 className={cx("state-name")}>{locationData.loc}</h1>
                <DetailedTile
                  locationData={{
                    ...locationData.summary,
                    total:
                      locationData.summary.confirmedCasesIndian +
                      locationData.summary.confirmedCasesForeign
                  }}
                />
                <Chart locationData={locationData} />
                <DistrictWiseList
                  districtWiseData={locationData.subLocations}
                />
{/*<NewsCard news={news} />*/}
              </section>
            )}
          </section>
        </>
      );
    }
  }
}
