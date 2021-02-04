const machine = require('../models/database');
const sql ='select * from [dbo].[M_STORE_WEB_INFOS] ' +
'where STORE_ID = @id  order by KID desc	FOR JSON PATH ;';
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'all';

exports.show = async function (req, res, next) {

  try {
      // 返却用オブジェクト
      let response = {};
      //logger.info(req.url);
      //logger.info(req.method);
      // データ取得
      let qualyRes = await machine.execSql(sql.replace('@id', req.params.id));
      // 検索結果が無いの場合
      if (!qualyRes){
        response.status = 404;
        response.message = '該当する情報がありませんでした';
      // 検索結果が有る場合
      } else {
        response.status = 200;
        response.result = JSON.parse(qualyRes);
      }

      // レスポンス設定
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.send (response);

  } catch (err) {
    console.error(err);
    var errres = new Error('システムエラーが発生しました!!');
    errres.status = 500;
    next(errres);
  }


};
