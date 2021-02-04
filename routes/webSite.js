const express = require('express');
const router = new express.Router();
const webSiteControllers = require('../controllers/WebSiteControllers');


router.get('/SHOP/Detail/:id([0-9]+)', webSiteControllers.show);
module.exports = router;
