var express = require('express');
var router = express.Router();
var xmlSiteMap = require('../controllers/xmlSiteMap');

router.get('/', xmlSiteMap.execute);
/*
router.get('/', function(req, res, next) {
    let err = new Error('該当する情報がありませんでした');
    err.status = 404;
    console.log('catch 404:'+ req.method + ':' + req.originalUrl);
    next(err);
  });
  */
module.exports = router;
