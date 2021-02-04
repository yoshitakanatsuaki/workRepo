module.exports = function(req, res, next) {
    let err = new Error('該当する情報がありませんでした');
    err.status = 404;
    console.log('catch 404:'+ req.method + ':' + req.originalUrl);
    next(err);
  };