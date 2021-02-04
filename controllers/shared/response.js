exports.setResponse =  function(status,result,message) {
    // 返却
    let response ={};
    response.status = status;
    response.result = result;
    if ( message ){
        response.message = message;
    }
    return response;
};
