var req_data = {
    username: "john"
}

$.ajax({
    'type': 'post',
    'url': '/test_con_req',
    'dataType': 'json',
    'data': req_data,
    'success': function(data){
        console.log(data);
    },
    'complete': function(){
        console.log("complete");
    }
});