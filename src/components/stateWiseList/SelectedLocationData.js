import React from "react";
import NewsCard from "./NewsCard";
import DetailedTile from "./DetailedTile";
import classNames from "classnames/bind";
const cx = classNames.bind(require("./stateWiseList.module.css"));
export default function StateWiseList(props) {
  const { locationData } = props;
  const isDataLoaded =
    locationData && Object.keys(locationData || {}).length > 0;
  const [news, setNews] = React.useState([]);
  React.useEffect(() => {
    fetch(
      `http://newsapi.org/v2/everything?q=coronavirus ${locationData.loc}&api=news&count=5&sortBy=publishedAt&apiKey=542dde4c96ed4664a7d652b9730c635c`
    )
      .then(res => res.json())
      .then(
        result => {
          setNews(result.articles || []);
        },
        error => {
          console.log("<<<<<<<<<<Error Response>>>>>>>>>>");
        }
      );
  }, [locationData.loc]);
  return (
    <>
      <section className={cx("list-wrapper")}>
        {!isDataLoaded && <div>Loading...</div>}
        {isDataLoaded && (
          <section>
            <h1>{locationData.loc}</h1>
            <DetailedTile
              locationData={{
                ...locationData,
                total:
                  locationData.confirmedCasesIndian +
                  locationData.confirmedCasesForeign
              }}
            />
            <NewsCard news={news} />
          </section>
        )}
      </section>
    </>
  );
}
