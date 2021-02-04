const ConnectionPool = require('tedious-connection-pool');
const Request = require('tedious').Request;
const express = require('express');
const app = express();
const dbconfig =  require('../config/default.json')[app.get('env')];
//create the pool
let pool = new ConnectionPool(dbconfig.poolConfig, dbconfig.db);


exports.execSql =  function(sql) {
  return new Promise((resolve, reject) => {
    console.log('Promise start:' + new Date());

    pool.on('error', function(err) {
      // アプリ起動後、SQLサーバー停止で入る
      console.error(new Date());
      console.error('dbConnectErr:' + err);
      reject(err);
      return;
    });

    //acquire a connection
    pool.acquire(function (err, connection) {
      if (err) {
          // コネクションプール取得できないタイムアウト
          console.error('pool.acquire' + err);
          reject(err);
          return;
      }
      let result = '';
      //use the connection as normal
      let request = new Request(sql, function(err, rowCount) {
        console.log('createRequest:' + new Date());
        if (err) {
          // 対象テーブル削除で入る
          console.error('createRequestErr:' + err);
          reject(err);
          return;
        } else {
          console.log('resolve:' + new Date());
          resolve(result);
        }
        console.log('rowCount: ' + rowCount);
        //release the connection back to the pool when finished
        connection.release();
      });

      request.on('row', function(columns) {
        console.log('value: ' + columns[0].value);
        result =columns[0].value;
      });
      // 設定しないとコネクションタイムアウトと同じ（既定は15秒）
      //request.setTimeout(timeout);
      connection.execSql(request);
    });
  });
};
