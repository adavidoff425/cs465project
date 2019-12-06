var express = require('express');
var router = express.Router();
const user_insert = require('./user_insert');
const home = require('./home');
const isUser = require('./users');
const fs = require('fs');
const APIKEY = 'AIzaSyAYNWMjJ6GEX_Ja-l9iWLVFnzh4MCxSvE0';
const Geocoder = require('node-geocoder');
const geocoder = Geocoder({
    provider: 'google',
    apiKey: APIKEY,
    httpAdapter: 'https',
  });

async function homeLoc(address) {
  let coords = [];
    await geocoder.geocode(address, function (err, geocode) {
     coords[0] = geocode[0].latitude;
     coords[1] = geocode[0].longitude;
  });  
  return coords;
};

/* GET landing page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'User Login' });
});


router.post('/submit', function(req, res, next) {
  const username = req.body.username; 
  const userSearch = isUser(username);
  if(userSearch != null) {
    res.render('home', { user: username, address: userSearch.home.address, lnglat: userSearch.home.coordinates });
  } else {
    var address = req.body.address;
    const results = homeLoc(address).then(result => {
      var req_data = {
        username : username,
        home_cord_first : result[0], 
        home_cord_second: result[1]
    }
    console.log(req_data);
    console.log(' inserting new user ');
    
    fs.readFile('./users.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            res.end()
            return;
        }
  
        let req_username = req_data.username;
        let req_home_cord_first = req_data.home_cord_first;
        let req_home_cord_second = req_data.home_cord_second;
        
  
  
        let users_json_all = JSON.parse(jsonString);
  
        let new_db_item = {
            "userid": Math.ceil(Math.random()*100),
            "name": req_username,
            "home": {
                "coordinates": [req_home_cord_first, req_home_cord_second]
            }
        }
  
        users_json_all["users"].push(new_db_item);
  
        // console.log(req_home_cord)
        // console.log(users_json_all);
        // console.log(users_json_all["users"]);
        
  
        let new_json_string = JSON.stringify(users_json_all);
        fs.writeFile('./users.json', new_json_string, err => {
            if(err){
                console.log(err)
            }
            else
            {
                console.log("write successful");
            }
        });
        res.render('home', { user: username, address: address, home_coords: [ req_home_cord_first, req_home_cord_second ]});
    })
  }).catch(err => {
      console.log(err);
      res.status(500).send("Error");
    });
  }
});

module.exports = router;
