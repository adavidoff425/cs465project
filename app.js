'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var landing = require('./routes/index');
var home = require('./routes/home');
//var editRouter = require('./routes/edit');
//var async = require('asyncawait/async');
//var await = require('asyncawait/await');

var apiKey = process.env.APIKEY;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'pug');

app.use('/', landing);
app.use('/home', home);

app.get('/', function(req, res, next) {
  res.render('index');  // implement view
});

app.get('/calendar', function (req, res) {
  res.render('calendar');
});

app.get('/home', function (req, res) {
  res.render('home');
});

/*app.post('/submit', function(req, res, next) {
  var username = req.body.username; 
// if(username == alreadyUser) // implement
    res.render('home', { user: username });
 // else
    res.render('index', { mode: 1 }); 
}); // moved to index.js route */



/*
app.post('/home', function(req, res, next) { // new user must enter home address
  var address = req.body.address;
  var query = address.split(' ').join('+');
  var home = map.addrSearch(query); // implement
  console.log(home);
  if(home)
    res.render('home', { user: username, home: home }); // pass new user and address query
  else {
    window.alert('Address not found. Please try again.');
    res.render('index', { mode: 1 });
  }
});*/


app.post('/test_db', (req, res) =>{
    fs.readFile('./db.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
            let i=0;
            let return_json = []
            let req_username = req.body.username;
            let db_json = JSON.parse(jsonString)["features"];

            console.log(req_username);

            for(i=0; i < db_json.length; i++)
            {
                console.log(db_json[i]["properties"]["username"]);

                if(db_json[i]["properties"]["username"] == req_username )
                {   
                    if(db_json[i]["properties"]["category"] != "home" )
                    {
                        return_json.push(db_json[i])
                    }
                    
                    
                }
            }
            res.json(return_json);
            res.end();
            
    })
    // res.end()
});

app.post('/test_db_insert', (req, res) =>{
    fs.readFile('./db.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            res.end()
            return
        }

        let req_username = req.body.username;
        let req_event_name = req.body.event_name;
        let req_event_desc = req.body.description;
        let req_category = req.body.category;
        let req_date = req.body.date;
        let req_time = req.body.time;

        let coord = [-122.6810424, 45.509023]


        let db_json_all = JSON.parse(jsonString);

        let new_db_item = {
            "geometry": {
                "type": "Point",
                "coordinates": coord
            },
            "type": "Feature",
            "properties": {
                "category": req_category,
                "time": req_time,
                "description": req_event_desc,
                "name": req_event_name,
                "date": req_date,
                "placeid": "01",
                "username": req_username            
            }
        }

        db_json_all["features"].push(new_db_item);

        console.log(db_json_all)
        console.log(db_json_all["features"])

        let new_json_string = JSON.stringify(db_json_all);
        fs.writeFile('./db.json', new_json_string, err => {
            if(err){
                console.log(err)
            }
            else
            {
                console.log("write successful");
            }
        });
        res.end();
            
    })
    // res.end()
});


app.listen(8080);

module.exports = app;
