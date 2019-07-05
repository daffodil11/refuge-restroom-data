const { toLatLon, toLatitudeLongitude, headingDistanceTo, moveTo, insidePolygon } = require('geolocation-utils');

const calculateTrapezoidArea = (lat, long, newLat) => {
  const corner1 = {lat, lon: long};
  const corner2 = {lat, lon: long + 1};
  const corner3 = {lat: newLat, lon: long};
  const corner4 = {lat: newLat, lon: long + 1};
  const midBottom = {lat, lon: long + 0.5};
  const midTop = {lat: newLat, lon: long + 0.5};
  const a = headingDistanceTo(corner1, corner2).distance;
  const b = headingDistanceTo(corner3, corner4).distance;
  const h = headingDistanceTo(midBottom, midTop).distance;
  return Math.round(((a + b) / 2) * h);
}

let count = 0;

//for (let lat = 0; lat < 60; lat++) {
  //for (let long = 0; long < 360; long++) {
    //const cell = [lat, long

let lat = 0;
const latitudes = [];

while (lat < 61) {
  const newLat = Math.round((lat + 1 / Math.cos(lat * (Math.PI/180))) * 100) / 100;
  latitudes.push(lat);
  //for (let long = 0; long < 180; long++) {
    //const cell = [lat, long, newLat, long + 1];
    ////count += 1;
    //if (Math.random() < 0.01) {
      ////const corner1 = {lat: cell[0], lon: cell[1]};
      ////const corner2 = {lat: cell[2], lon: cell[3]};
      //console.log(calculateTrapezoidArea(lat, long, newLat));
    //}
  //}
  lat = newLat;
}

//const latitudes2 = Array.from({ length: 60 }, (_, i) => Math.round(i * Math.sqrt(1 / Math.cos(i * (Math.PI / 180))) * 100) /100);

console.log(latitudes);
//console.log('For comparison: ')
////const loc1 = {lat: 52.96, lon: 11};
////const loc2 = {lat: 53.96, lon: 12};
//console.log(calculateTrapezoidArea(22.54, 45, 23.54));
//console.log(calculateTrapezoidArea(52.96, 11, 53.96));

const findLat = (lat) => {
  const section = latitudes.slice(0, Math.floor(Math.abs(lat))).reverse();
  if (lat > 0) {
    return section.find(e => e < lat);
  } else {
    return 0 - section[section.findIndex(e => e < Math.abs(lat)) - 1];
  }
}

console.log(findLat(37.1));
console.log(findLat(-42.045));

const transformRecord = ({ city, country, accessible, unisex, changing_table, latitude, longitude }) => {
}

