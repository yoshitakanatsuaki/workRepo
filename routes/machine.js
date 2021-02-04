const express = require('express');
const router = new express.Router();
const machine = require('../controllers/machine');
const machine2 = require('../controllers/machine2');

router.get('/machine/:id', machine.show);
router.get('/machine2/:id', machine2.show);

module.exports = router;
