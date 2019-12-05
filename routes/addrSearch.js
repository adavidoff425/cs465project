const search = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
const apiKey = 'AIzaSyAYNWMjJ6GEX_Ja-l9iWLVFnzh4MCxSvE0';
const https = require('https');
let result = [];
let callBack = function(data) {
  result.push(data);
  return result;
}

const getData = function (url, callback) {
  https.get(url, (res) => {
    let body = '';    
    res.on('data', function (data) {
      body += data;
    });

    res.on('end', function () {
      if(JSON.parse(body).results !== null){
        callBack(JSON.parse(body).results[0]);
      }
    });
  });
}

module.exports = query => {
  const { address } = query;
  let url = `${search}?key=${apiKey}&query=${address}`
  getData(url, callBack);
};
