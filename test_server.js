const express = require('express');
const parser = require('body-parser');
var mysql = require('mysql');
const server = express();
const fs = require('fs');


server.use(parser.urlencoded({
    'extended': false,
    'limit': 1024
}))


//setting middleware
server.use(express.static(__dirname + '/')); //Serves resources from / folder

server.post('/test_res', (req, res) => {
    console.log("in test_res");
    res.json({text: "hello world"});
});

server.post('/test_con', (req, res) =>{
    console.log("in test_con");

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "test_instance"
    });
      
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });

    res.json({"text": "connected"});
});

server.post('/test_send_data', (req, res) =>{
    console.log("in test_con");

    console.log(req.body.username);

    res.json({"text": "connected"});
});

server.post('/test_con_req', (req, res) =>{
    console.log("in test_con_req");

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "web_dev_project"
    });

    mysql_query = "SELECT * FROM event_table WHERE username='" + req.body.username + "'";

    console.log(mysql_query);
    
    res_json = {};
    
    con.connect(function(err) {
        if (err) throw err;

        con.query(mysql_query, function (err_query, result, fields){
            if(err_query) throw err_query;
            // console.log(result);
            res_json = result;
            console.log(res_json)
            res.json(res_json);
            res.end();
            con.end();
        });
        // con.end();
    });

    // console.log("end of test_con_req");
    // res.json(res_json);
    // res.end();    
});


server.post('/test_insert_user', (req, res) =>{
    console.log("in test_insert_user");

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "web_dev_project"
    });

    // mysql_query = " INSERT INTO 'user_table' ('id', 'username', 'home_location_id', 'home_location_long', 'home_location_lat', 'home_address') VALUES (NULL, '" + req.body.username + "', NULL, NULL, NULL, NULL);";
    mysql_query = "INSERT INTO `user_table` (`id`, `username`, `home_location_id`, `home_location_long`, `home_location_lat`, `home_address`) VALUES (NULL, '" + req.body.username + "', NULL, NULL, NULL, NULL);";
    console.log(mysql_query);
    
    res_json = {};
    
    con.connect(function(err) {
        if (err) throw err;

        con.query(mysql_query, function (err_query, result, fields){
            if(err_query) throw err_query;
            // console.log(result);
            res_json = result;
            console.log(res_json)
            res.json(res_json);
            res.end();
            con.end();
        });
        
    });
});

//old
server.post('/test_insert_event', (req, res) =>{
    console.log("in test_insert_event");

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "web_dev_project"
    });

    mysql_query = "INSERT INTO `event_table` (`id`, `event_name`, `username`, `location_id`, `location_long`, `location_lat`, `location_address`, `category`, `date`, `time`) VALUES (NULL, '" + req.body.event_name + "', '" + req.body.username + "', NULL, NULL, NULL, NULL, '" + req.body.category + "', '" + req.body.date + "', '" + req.body.time + "');";
    // mysql_query = "INSERT INTO `event_table` (`id`, `event_name`, `username`, `location_id`, `location_long`, `location_lat`, `location_address`, `category`, `date`, `time`) VALUES (NULL, 'anniversery', 'bob', NULL, NULL, NULL, NULL, 'personal', '2019-12-20', '08:00:00'); ";

    console.log(mysql_query);
    
    res_json = {};
    
    con.connect(function(err) {
        if (err) throw err;

        con.query(mysql_query, function (err_query, result, fields){
            if(err_query) throw err_query;
            // console.log(result);
            res_json = result;
            console.log(res_json)
            res.json(res_json);
            res.end();
            con.end();
        });
        
    });
});


server.post('/test_db', (req, res) =>{
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

server.post('/test_db_insert', (req, res) =>{
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


server.listen(8080);
