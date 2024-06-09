//Home Controller
var shortid = require('shortid');
var async = require('async');
var User = require('./../models/UserModel');
var request = require('request');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var generator = require('generate-password');

module.exports = { 


    loginpage: function(req,res,next){
        var messages = req.flash('error');
         res.render('users/login',{ messages: messages});
     },


     fgpassword: function(req,res,next){
        var messages = req.flash('error');
         res.render('users/recover',{ messages: messages});
     },

     postfgpassword: function(req,res,next){

        req.checkBody('email','Invalid Email').isEmail();

        var errors = req.validationErrors();

        if (errors){
            var messages = [ ];
            errors.forEach(function(error){
                messages.push(error.msg);
            });
            req.flash('error',messages);

            return res.redirect('/forgot-password'); 
        }
        async.waterfall([
            function(done) {
              crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
              });
            },
            function(token, done) {
              User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                  req.flash('error', 'No account with that email address exists.');
                  return res.redirect('/forgot');
                }
        
                user.p_token = token;
                user.p_tokenexpires = Date.now() + 600000; // 1 hour
        
                user.save(function(err) {
                  done(err, token, user);
                });
              });
            },
            function(token, user, done) {
              var smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'apkteam2@gmail.com',
                  pass: 'icanwin123'
                }
              });
              var mailOptions = {
                to: user.email,
                from: 'passwordreset@demo.com',
                subject: 'Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                  'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
              };
              setTimeout(function(){
                smtpTransport.sendMail(mailOptions, function(err) {

                });
              },200)
            //   smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('error', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(null, 'done');
            //   });
            }
          ], function(err) {
            if (err) return next(err);
            res.redirect('/forgot-password');
          });

     },

     resetpassword: function(req,res,next){
        User.findOne({ p_token: req.params.token, p_tokenexpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
              req.flash('error', 'Password reset token is invalid or has expired.');
              return res.redirect('/forgot-password');
            }
            var messages = req.flash('error');
            res.render('users/reset', {
              user: req.user,
              token: req.params.token,
              messages:messages
            });
          });
    },
     postresetpassword: function(req,res,next){

        req.checkBody('rpassword','Passwords do not match.').equals(req.body.rpassword1);

        var errors = req.validationErrors();
            if (errors){
                var messages = [ ];
                errors.forEach(function(error){
                    messages.push(error.msg);
                });
                req.flash('error','passwords do not match');
                return res.redirect('back'); 
            }
            async.waterfall([
                function(done) {
                  User.findOne({ p_token: req.params.token, p_tokenexpires: { $gt: Date.now() } }, function(err, user) {
                    if (!user) {
                      req.flash('error', 'Password reset token is invalid or has expired.');
                      return res.redirect('back');
                    }
            
                    user.password = req.body.rpassword;
                    user.p_token = undefined;
                    user.p_tokenexpires = undefined;
            
                    user.save(function(err) {
                      req.logIn(user, function(err) {
                        done(err, user);
                      });
                    });
                  });
                },
                function(user, done) {
                    var smtpTransport = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: 'apkteam2@gmail.com',
                          pass: 'icanwin123'
                        }
                      });
                  var mailOptions = {
                    to: user.email,
                    from: 'passwordreset@demo.com',
                    subject: 'Your password has been changed',
                    text: 'Hello,\n\n' +
                      'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                  };
                  smtpTransport.sendMail(mailOptions, function(err) {
                    req.flash('success', 'Success! Your password has been changed.');
                    done(err);
                  });
                }
              ], function(err) {
                res.redirect('/');
              });
    },
 
     postlogin: function(req,res,next){
         res.redirect('/user/dashboard');
     },
 
     registerpage: function(req,res,next){
 
         var messages = req.flash('error');
         res.render('users/register',{ messages: messages});
     },
 
     postregister: function(req,res,next){
 
         req.checkBody('email','Invalid Email').notEmpty().isEmail();
         req.checkBody('phoneno','phoneno cannot be empty').notEmpty();
         req.checkBody('phoneno','Enter Valid Phone Number').isLength({ min:10 });
         var errors = req.validationErrors();
         if (errors){
             var messages = [ ];
             errors.forEach(function(error){
                 messages.push(error.msg);
             });
             req.flash('error',messages);
 
             return res.redirect('/register'); 
         }
         User.findOne({'email':req.body.email },function(err,user){
                 if(user){
                     req.flash('error','Email Already Exist');
                     return res.redirect('/register');
                 }
         });
 
         async.waterfall([
             function(done){
                 var pass = Math.floor(100000 + Math.random() * 900000);
                 done(null,pass);
             },
             function(pass,done){
 
                 var u = new User({
                     name: req.body.name,
                     email: req.body.email,
                     password: pass,
                     phoneno:req.body.phoneno
                 });
                 u.save(function(err,user){
                    done(err,pass,user);
                 
                 });
 
             },function(pass,user,done){

              var url = "http://api.msg91.com/api/sendhttp.php";

              var message = 'use '+ pass +' as Login Password For email id '+ user.email +' at seotools';

              var propertiesObject = { 
                sender:'SEOTOO', 
                authkey:'193800ANu4FRIU5a606cc8',
                route:'4',
                mobiles:user.phoneno,
                country:'91',
                message:message
              };
              
              request({url:url, qs:propertiesObject}, function(err, response, body) {
                if(err) { console.log(err); return; }
                req.flash('error',"Account created successfully. Password sent to your mobile number via SMS.");  
                res.redirect('/login');
              });


                //  request({
                //      url: 'https://api.textlocal.in/send/?',
                //      method: 'POST',
                //      form: {
                //      apikey: 'n+vaa2zRwF8-4CeA3EgxaZjGQg8LIQjgPszqiuD9F3',
                //      numbers:'91'+user.phoneno+'',
                //      message:'Use '+ pass +' as Your Login Pass for emailid '+user.email+' at seotools.com',
                //      sender:'TXTLCL'
                //  }
                //    }, function(error, response, body){
                //      console.log(body);
                //      req.flash('error',"Account created successfully. Password sent to your mobile number via SMS.<a href='/login'>login Here</a>");  
                //      res.redirect('/register');
                //    });


               
             
                
             }
         ])
 
      
     }


}
