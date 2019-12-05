var req_data = {
    username : "bob",
    home_cord_first : -122.6810424, 
    home_cord_second: 45.509023
}

$.ajax({
    'type': 'post',
    'url': '/db_insert_user',
    'dataType': 'json',
    'data': req_data,
    'success': function(data){
        console.log(data);
    },
    'complete': function(){
        console.log("complete");
    }
});