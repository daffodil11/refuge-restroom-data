const axios = require('axios');
const start = Date.now();

const request = (n) => {
  return axios.get(`https://www.refugerestrooms.org/api/v1/restrooms.json?page=${n}&per_page=99`)
  .then(({ data }) => {
    //console.log(data);
    console.log(Date.now() - start);
  });
}

Promise.all(Array.from({ length: 8 }, (_, i) => request(i + 1)));

let lat = 0;
const latitudes = [];
const bigObj = {};

while (lat < 61) {
  const newLat = Math.round((lat + 1 / Math.cos(lat * (Math.PI/180))) * 100) / 100;
  latitudes.push(lat);
  lat = newLat;
}

const findLat = (lat) => {
  const section = latitudes.slice(0, Math.floor(Math.abs(lat))).reverse();
  if (lat > 0) {
    return section.find(e => e < lat);
  } else {
    return 0 - section[section.findIndex(e => e < Math.abs(lat)) - 1];
  }
}

const commitRecord = ({ city, country, accessible, unisex, changing_table, latitude, longitude }) => {
  const cell = [findLat(latitude), Math.floor(longitude)];
}
