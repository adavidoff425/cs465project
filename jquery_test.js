var req_data = {
    event_name: "anniversery",
    username: "joe",
    category: "personal",
    date: "2019-12-20",
    time: "08:00:00"

}

$.ajax({
    'type': 'post',
    'url': '/test_insert_event',
    'dataType': 'json',
    'data': req_data,
    'success': function(data){
        console.log(data);
    },
    'complete': function(){
        console.log("complete");
    }
});