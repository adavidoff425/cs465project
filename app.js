"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var path = require("path");
var landing = require("./routes/index");
var home = require("./routes/home");
const fs = require("fs");
//var editRouter = require('./routes/edit');
//var async = require('asyncawait/async');
//var await = require('asyncawait/await');

var apiKey = process.env.APIKEY;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "pug");

app.use("/", landing);
app.use("/home", home);
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.get("/", function(req, res, next) {
  res.render("index");
});

app.get("/calendar", function(req, res) {
  res.render("calendar");
});

app.get("/home", function(req, res) {
  res.render("home");
});

app.post("/test_db", (req, res) => {
  //console.log("here");
  fs.readFile("./public/places.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    let i = 0;
    let return_json = [];
    let req_username = req.body.username;
    let db_json = JSON.parse(jsonString)["features"];

    //console.log(req_username);

    for (i = 0; i < db_json.length; i++) {
      //console.log(db_json[i]["properties"]["username"]);

      if (db_json[i]["properties"]["username"] == req_username) {
        if (db_json[i]["properties"]["category"] != "home") {
          return_json.push(db_json[i]);
        }
      }
    }
    res.json(return_json);
    res.end();
  });
  // res.end()
});

app.post("/addevent", (req, res) => {
  fs.readFile("./public/places.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      res.end();
      return;
    }

  let db_json_all = JSON.parse(jsonString);

  let req_username = req.body.req_username;
  let req_event_name = req.body.event_name;
  let req_event_desc = req.body.description;
  let req_category = req.body.category;
  let req_date = req.body.date;
  let req_time_start = req.body.startTime;
  let req_time_end = req.body.endTime;
  let req_coord = [];
  req_coord.push(parseFloat(req.body.lng));
  req_coord.push(parseFloat(req.body.lat));

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
        "placeid": Math.ceil(Math.random()*100),
        "username": req_username
      }
    };

  db_json_all["features"].push(new_db_item);

    console.log(+db_json_all);
    console.log(db_json_all["features"]);

    let new_json_string = JSON.stringify(db_json_all);
    fs.writeFile("./public/places.json", new_json_string, err => {
      if (err) {
        console.log(err);
      } else {
        console.log("write successful");
      }
    });
    res.end();
  });
  res.render("calendar", { user: req.body.username });
});

app.post("/test_db_insert", (req, res) => {
  fs.readFile("./db.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      res.end();
      return;
    }

    let req_username = req.body.username;
    let req_event_name = req.body.event_name;
    let req_event_desc = req.body.description;
    let req_category = req.body.category;
    let req_date = req.body.date;
    let req_time = req.body.time;
    let req_coord = req.body.coords;

    let db_json_all = JSON.parse(jsonString);

    let new_db_item = {
      geometry: {
        type: "Point",
        coordinates: req_coord
      },
      type: "Feature",
      properties: {
        category: req_category,
        time: req_time,
        description: req_event_desc,
        name: req_event_name,
        date: req_date,
        placeid: "01",
        username: req_username
      }
    };

    db_json_all["features"].push(new_db_item);

    console.log(+db_json_all);
    console.log(db_json_all["features"]);

    let new_json_string = JSON.stringify(db_json_all);
    fs.writeFile("./db.json", new_json_string, err => {
      if (err) {
        console.log(err);
      } else {
        console.log("write successful");
      }
    });
    res.end();
  });
  // res.end()
});


app.post('/db_insert_user', (req, res) =>{
  fs.readFile('./users.json', 'utf8', (err, jsonString) => {
      if (err) {
          console.log("File read failed:", err)
          res.end()
          return
      }

      let req_username = req.body.username;
      let req_home_cord_first = req.body.home_cord_first;
      let req_home_cord_second = req.body.home_cord_second;
      


      let users_json_all = JSON.parse(jsonString);

      let new_db_item = {
          "userid": 1,
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
              // console.log("write successful");
          }
      });
      res.end();
          
  })
  // res.end()
});

app.listen(8080);

module.exports = app;
