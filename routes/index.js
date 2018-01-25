var express = require('express');
var router = express.Router();
var HomeController = require('./../Controllers/HomeController');
var passport = require('passport');
var get_ip = require('ipware')().get_ip;
var User = require('./../models/UserModel');
var Log = require('./../models/LogModel');



function isloggedin(req,res,next){
  if(!req.isAuthenticated()){
     return next();
  }
  res.redirect('/user/dashboard');
}

function logmd(req,res,next){


       if(req.body.email){
          User.findOne({ email:req.body.email },function(err,user){
                if(err){
                    return;
                  }
                var log = new Log();

                log.ip = get_ip(req).clientIp;
                log.user_id = user._id;
                log.message = "loggedin";
                log.useragent = req.headers['user-agent'];

                log.save();

          });

          next();

      }

}


/* GET home page. */
router.get('/', isloggedin,function(req, res, next) {
  res.cookie('cookieName',"google", { maxAge: 900000, httpOnly: true });
  res.render('users/index', { title: 'Express' });
});


router.get('/login',isloggedin, HomeController.loginpage);

router.post('/login',logmd,isloggedin,passport.authenticate('local-login', {
  successRedirect : '/user/dashboard', // redirect to the secure profile section
  failureRedirect : '/login', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

router.get('/register',isloggedin,HomeController.registerpage);

router.post('/register',isloggedin, HomeController.postregister);

router.get('/forgot-password',isloggedin, HomeController.fgpassword);

router.post('/forgot-password',isloggedin, HomeController.postfgpassword);

router.get('/reset/:token', isloggedin,HomeController.resetpassword);

router.post('/reset/:token', isloggedin,HomeController.postresetpassword);



module.exports = router;
