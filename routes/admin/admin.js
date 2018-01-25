var express = require('express');
var router = express.Router();
var ServiceController = require('./../../Controllers/ServiceController');
var passport = require('passport');
var multer = require('multer');
const cryptoRandomString = require('crypto-random-string');

var storage = multer.diskStorage({
     destination:function(req,file,cb) {
         cb(null,'./uploads');
         
     },
     filename:function(req,file,cb) {
         var ext = file.mimetype.split('/')[1];
        cb(null,cryptoRandomString(16) + '.'+ext);
         
     }
})
var upload = multer({ storage:storage });

router.post('/service',upload.single('p_img'),ServiceController.postService);



module.exports = router;



