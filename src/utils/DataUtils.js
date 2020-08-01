export const groupMetricsByStateAndCountry = (data) => {
    const internationalDataLookup = Array.isArray(data)
      ? data
      .filter((data) => data.lat && data.long_)
      .reduce((intLookup, data) => {
        const key = `${data.province_state}.${data.country_region}`;
        if (intLookup[key]) {
          intLookup[key] = {
            ...intLookup[key],
            deaths: intLookup[key].deaths + data.deaths,
            confirmed: intLookup[key].confirmed + data.confirmed,
            recovered: intLookup[key].recovered + data.recovered,
            active: intLookup[key].active + data.active,
          };
          return intLookup;
        }
        intLookup[key] = data;
        return intLookup
      }, {})
      : {};
    return Object.keys(internationalDataLookup).map(key => internationalDataLookup[key]);
  }