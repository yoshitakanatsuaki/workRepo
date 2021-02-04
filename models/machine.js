const Connection = require('tedious').Connection;

exports.dbConnect =  function(config) {
  return new Promise((resolve, reject) => {

    // ... some callback nesting for connection and request
    const connection = new Connection(config);

    connection.on("connect", (err) => {
      if (err) {
        reject(err);
      } else {
        console.log("dbConnect" + new Date());
        resolve(connection);
      }
    });
  });
};




exports.select =  function(sql,connection) {
  return new Promise((resolve, reject) => {
console.log('select start' + new Date());
    // ... some callback nesting for connection and request
    var Request = require('tedious').Request;
    let result = '';
    const request = new Request(sql	,  (err, row) => {
      if (err) {
        reject(err);
      } else {
        console.log('件数:' + row);
        resolve(result);
      }
    });

    request.on('row', function (columns) {

      columns.forEach(function (column) {
        if (column.value === null) {
          console.log('NULL')
        } else {
          result+= column.value;
        }
      });
    });

    console.log('connection.execSql(request)' + new Date());
    connection.execSql(request);  // 追加した処理
  });
};



exports.dbClose =  function(connection) {
    if(connection){
        console.log("dbClose");
        connection.close();
    }
};
