const website = require('../models/Website');
const fileHelper = require('../controllers/shared/file');
const holidayHelper = require('../controllers/shared/holiday');
const responseHelper = require('../controllers/shared/response');

function setErr(status,msg) {
  let err = new Error(msg);
  err.status = status;
  return err;
}

function deleteObj(responseObj) {
  // 掲載フラグ毎にプロパティを削除
  // TODO 全掲載フラグやる
  if (!responseObj[0].storeinfo.IS_PUBLISH_MAIN_EQUIPMENT){
  delete responseObj[0].MAIN_EQUIPMENTS;
  }
  return responseObj;
}


// eslint-disable-next-line max-statements
exports.show = async function (req, res, next) {
  try {
      // データ抽出
      const qualyRes = await website.dbConnect(req.params.id);

      // データ抽出結果 有無チェック
      if (!qualyRes){
        next(setErr(404,'該当する情報がありませんでした'));
        return;
      }

      // クライアントへのレスポンス用に加工する為、パース
      let responseObj = JSON.parse(qualyRes);

      // 店舗画像を取得
      let filepaths =[];
      let storeWebPictures =responseObj[0].store_web_pictures;
      if (storeWebPictures) {
        for (let i = 0; i < responseObj[0].store_web_pictures.length; i++) {
          filepaths.push(storeWebPictures[i].ORIGINAL_PICTURE_PATH);
        }
      }

      const allre = await Promise.all( filepaths.map( async (filepath) => {
        return await fileHelper.readFileEx(filepath);
      } ) );

      for (let i = 0; i < allre.length; i++) {
        responseObj[0].store_web_pictures[i].PICTIRE_INFO = allre[i];
      }

      // 定休日取得
      let hs = responseObj[0].storeinfo.HOLIDAY_SETTING;
      if (hs) {
        responseObj[0].storeinfo.HOLIDAY =  await holidayHelper.getHoliday(hs);
      }

      // 掲載フラグ毎にプロパティを削除
      responseObj = deleteObj(responseObj);

      // レスポンス
      res.json (responseHelper.setResponse(200,responseObj,''));
  } catch (err) {
      console.error(err);
      next(setErr(500,'システムエラーが発生しました'));
  }
};

