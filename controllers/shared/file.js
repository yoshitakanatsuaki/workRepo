var fs = require('fs');

// 非同期でファイルを読み込みBase64してPromiseを返す
exports.readFileEx =  function(filePath) {
  return new Promise( ( resolve, reject ) => {
    fs.readFile(filePath, 'base64' , (err, data) => {
      if (err){
        reject(err);
      } else {
        resolve(data);
      }
      console.log('readfileEND' + new Date());

    });
  });
};
