const express = require('express');
const app = express();
console.log(app.get('env'));
const machine = require('../models/machine');
const dbconfig =  require('../config/default.json')[app.get('env')];
const sql ="select * from [dbo].[M_STORE_WEB_INFOS] where STORE_ID = '@id'  order by KID desc	FOR JSON PATH ;"
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'all';

  // 非同期でファイルを読み込みBase64してPromiseを返す
  const fs = require('fs');
  const readFileEx = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'base64'
        , (err, data) => {
          if (err){
            reject(err);
          } else {
            resolve(data);
          }
        });
    });
  };
exports.show = async function (req, res, next) {


  let db = null;

  try {
      // 返却用オブジェクト
      let response = {};
      //logger.info(req.url);
      //logger.info(req.method);

      // コネクション取得
      db = await machine.dbConnect(dbconfig.db);
      // データ取得
      const qualyRes = await machine.select(sql.replace('@id', req.params.id),db);

      // 検索結果が無いの場合
      if(!qualyRes){
        response.status = 404;
        response.message = '該当する情報がありませんでした';
      // 検索結果が有る場合
      }else{
        response.status = 200;
        response.result = JSON.parse(qualyRes);
      }

      // コネクション切断
      machine.dbClose(db);

      // レスポンス設定
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.send (response);

  } catch (err) {
      machine.dbClose(db);
      logger.error(err);
      var err = new Error('システムエラーが発生しました');
      err.status = 500;
      next(err);
  }
}
