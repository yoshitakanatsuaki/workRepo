
const xmlSiteMap = require('../models/xmlSiteMap');
const xml2js = require("xml2js");
const fs = require('fs');

exports.execute = async function (req, res, next) {
let obj ={};
  // 非同期でファイルを読み込みBase64してPromiseを返す
    const writeFileEx = (filePath,xml) => {
      return new Promise((resolve, reject) => {
          fs.writeFile(filePath,xml
          , (err, data) => {

            if(err) {
              reject(err);
            } else {
              resolve(data);
            }
              console.log('Sitemap updated.');
            });
          });
      };

  // 非同期でファイルを読み込みBase64してPromiseを返す
    const readFileEx = (filePath) => {
      return new Promise((resolve, reject) => {
          fs.readFile(filePath
          , (err, data) => {
            xml2js.parseString(data.toString(), (err, result)=> {
              if(err) {
                // パース出来ない場合は成功とする（空ファイル）
                resolve();
              } else {
                const foo = [];
                for (let i = 0; i < result.urlset.url.length; i++) {
                  foo.push(result.urlset.url[i].loc[0].replace( baseUrl, '' ));
                }
                resolve(foo);

              }
            });
          });
      });
    }

  try {
      const qualyRes = await xmlSiteMap.dbConnect();

      obj = JSON.parse(qualyRes);

      // ルートURL
      var baseUrl = 'http://sample.com/';
      // 各ページのurl要素
      var urls = [];
      // lastmod用日付生成
      var today = new Date();
      var date = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
      // トップページ
      //urls.push({ loc:baseUrl, priority:'1.0', lastmod:date });

      // 既存XMLファイルを読み込み、店舗IDのリストを作る
      const oldStoreIDArray = await readFileEx('routes/sitemap.xml');

      // 新たにXMLファイルを作成するか
      let execFlg = false;

      let notexitCount = 0;

      // 店舗詳細ページ
      for (let i = 0; i < obj.length; i++) {
        urls.push({ loc:baseUrl+obj[i].STORE_ID, priority:'1.0', lastmod:date });

        if(oldStoreIDArray && oldStoreIDArray.indexOf(obj[i].STORE_ID) < 0){
          notexitCount++;
        };
      }

      // urlsetをルート要素としてXMLビルダーを初期化
      var builder = new xml2js.Builder({ rootName : "urlset" });
      // urlsをセット
      var xml = builder.buildObject({ url : urls });

      // TODO xmlns追加(リプレイスしているけど他によい方法あるか)
      xml = xml.replace(/<urlset>/, '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

      if(oldStoreIDArray && oldStoreIDArray.length===obj.length && notexitCount === 0){
        console.log('前回と一緒などで処理しない');

      }else{
        // ファイル書き出し
        await writeFileEx('routes/sitemap.xml',xml);

      }



      res.set('Content-Type', 'application/xml; charset=utf-8');
      res.send (xml);
      console.log('END.');
  } catch (err) {
      console.log(err)
      var err = new Error('システムエラーが発生しました');
      err.status = 500;
      next(err);
  }


}
