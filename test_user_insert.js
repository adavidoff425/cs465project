/*var req_data = {
    username : "bob",
    home_cord_first : -122.6810424, 
    home_cord_second: 45.509023
}*/
var express = require('express');
var router = express.Router();
var fs = require('fs');
router.use(express.json());

module.exports = req_body => {
    router.post("/test_db_insert", (req, res) => {
    fs.readFile('./users.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            res.end()
            return
        }
  
        let req_username = req_body.username;
        let req_home_cord_first = req_body.home_cord_first;
        let req_home_cord_second = req_body.home_cord_second;
        
  
  
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
        res.end();
    })
    // res.end()
});
};