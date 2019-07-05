const axios = require('axios');
const fs = require('fs');
const latitudes = [];
//const bigObj = {};

const request = (n) => {
  return axios.get(`https://www.refugerestrooms.org/api/v1/restrooms.json?page=${n}&per_page=99`)
  .then(({ data }) => {
    return data.map(({ city, accessible, unisex, changing_table, latitude, longitude }) => {
      const cell = [findLat(latitude), Math.floor(longitude)].join(',');
      return {
        cell,
        city,
        total_records: 1,
        accessible_count: (accessible) ? 1 : 0,
        unisex_count: (unisex) ? 1 : 0,
        changing_table_count: (unisex) ? 1 : 0
      }
    }); 
  })
  .catch(err => {
    console.log(err);
    return [];
  });
}

let lat = 0;

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

const transformData = ([key, val]) => {
  return {
    ...val,
    latitude: parseFloat(key.split(',')[0]),
    longitude: parseFloat(key.split(',')[1])
  }
}

Promise.all(Array.from({ length: 405 }, (_, i) => request(i + 1))).then(dataArrays => {
  const bigObj = {};
  dataArrays.forEach(arr => {
    arr.forEach(obj => {
      if (bigObj[obj.cell]) {
        bigObj[obj.cell].total_records += obj.total_records;
        bigObj[obj.cell].accessible_count += obj.accessible_count;
        bigObj[obj.cell].unisex_count += obj.unisex_count;
        bigObj[obj.cell].changing_table_count += obj.changing_table_count;
      } else {
        const {cell, ...record} = obj;
        bigObj[cell] = record;
      }
    });
  });
  fs.writeFile('restroom_data.json', JSON.stringify(Object.entries(bigObj).map(transformData), null, 2), (err) => {
    if (err) console.log(err);
  });
});

