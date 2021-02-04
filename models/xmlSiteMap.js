const express = require('express');
exports.dbConnect =  function() {
  return new Promise((resolve, reject) => {

    // ... some callback nesting for connection and request
    const tedious = require("../node_modules/tedious")
    const TYPES = require('tedious').TYPES;
    const connection = new tedious.Connection({
      server: "localhost",
      authentication: {
        type: "default",
        options: {
          userName: "read",
          password: "heaven0711"
        },
        database: "tempo"
      }
    });

connection.on("connect", (err) => {
  console.log("接続されました!");
  const request = new tedious.Request("select distinct STORE_ID from [dbo].[M_STORE_WEB_INFOS] where CREATE_TYPE =2  FOR JSON PATH  ;"	,

  (err, row) => {
    if (err) {
      console.log(err);
      reject(err);
    } else {
      if(!row){
        resolve(row);
      }
      console.log('件数:' + row);
    }
    console.log('connection.close()');
    connection.close();
    });

  var result = "";
  request.on('row', function (columns) {
    columns.forEach(function (column) {
      if (column.value === null) {
        console.log('NULL')
      } else {

        result+= column.value
      }
    })
      resolve(result);
  })

  connection.execSql(request);  // 追加した処理
});

   // ...
  });
}
