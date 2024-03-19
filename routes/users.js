var express = require('express');
var router = express.Router();
var UserController = require('./../Controllers/UserController');

var passport = require('passport');

function isloggedin(req,res,next){
      if(req.isAuthenticated()){
         return next();
      }
      res.redirect('/');
}


/* GET users listing. */
router.get('/', isloggedin,function(req, res, next) {
  res.send(req.user);
});
// router.get('/login', UserController.loginpage);
// router.post('/login',passport.authenticate('local-login', {
//   successRedirect : '/users', // redirect to the secure profile section
//   failureRedirect : '/users/login', // redirect back to the signup page if there is an error
//   failureFlash : true // allow flash messages
// }));

// router.get('/register',UserController.registerpage);

// router.post('/register', UserController.postregister);


router.get('/dashboard', isloggedin,UserController.getDash);
router.get('/edit-profile', isloggedin,function(req,res,next){
      res.render('users/editprofile');

});

router.get('/logout', isloggedin,UserController.logout);


module.exports = router;
