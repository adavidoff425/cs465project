var req_data = {
    event_name: "anniversery",
    username: "alexdavidoff",
    category: "personal",
    date: "20/12/2019",
    time: "8am",
    adress: "123 abe lincoln street",
    description: "an anniversary"

}

$.ajax({
    'type': 'post',
    'url': '/test_db',
    'dataType': 'json',
    'data': req_data,
    'success': function(data){
        console.log(data);
    },
    'complete': function(){
        console.log("complete");
    }
});