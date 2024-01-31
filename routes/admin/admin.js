var express = require('express');
var router = express.Router();
var ServiceController = require('./../../Controllers/ServiceController');
var passport = require('passport');

//Controller for Service
router.post('/service',ServiceController.postService);



module.exports = router;



