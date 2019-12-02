const express = require('express');
const parser = require('body-parser');
var mysql = require('mysql');
const server = express();

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

server.listen(8080);
