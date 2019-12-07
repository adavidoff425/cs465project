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
     coords[0] = geocode[0].longitude;
     coords[1] = geocode[0].latitude;
  });  
  return coords;
};

/* GET landing page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'User Login' });
});


router.post('/submit', function(req, res, next) {
  const username = req.body.username; 
  req.app.locals.user = username;
  const userSearch = isUser(username);
  if(userSearch != null) {
    if(userSearch.home == null) {
	    userSearch.home = ({
	        "address": "2758 se 52nd ave",
                "coordinates": [
                    -122.6810424,
                    45.509023 
	    });
    }
    res.render('home', { user: username, address: userSearch.home.address, lnglat: userSearch.home.coordinates });
  } else {
    var address = req.body.address;
    if(address == null) address = "2758 se 52nd ave";
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
                "address": address,
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
        fs.readFile("public/places.json", "utf8", (err, jsonString) => {
          if (err) {
            console.log("File read failed:", err);
            res.end();
            return;
          }
      
        let db_json_all = JSON.parse(jsonString);
      
        let req_username = req_data.username;
        let req_event_name = "HOME";
        let req_event_desc = "";
        let req_category = "home";
        let req_date = "";
        let req_time_start = "";
        let req_time_end = "";
        let req_coord = [req_data.home_cord_first, req_data.home_cord_second];
      
        const new_db_item = {
            "geometry": {
              "type":"Point",
              "coordinates": req_coord
            },
            "type":"Feature",
            "properties": {
              "category": req_category,
              "start_time": req_time_start,
              "end_time": req_time_end,
              "description": req_event_desc,
              "name": req_event_name,
              "date": req_date,
              "placeid": Math.ceil(Math.random()*1000),
              "username": req_username
            }
          };
      
        db_json_all["features"].push(new_db_item);
      
          let new_json_string = JSON.stringify(db_json_all);
          fs.writeFile("public/places.json", new_json_string, err => {
            if (err) {
              console.log(err);
            } else {
              console.log("write of home successful");
            }
          });
          res.end();
        });
        console.log(req_data);
        res.render('home', { user: req_data.username, address: address, lnglat: [ result[0], result[1] ]});
    })
  }).catch(err => {
      console.log(err);
      res.status(500).send("Error");
    });
  }
});

module.exports = router;
