
var LocalStrategy   = require('passport-local').Strategy;

var User = require('./../models/UserModel');


module.exports = function(passport){
      // used to serialize the user for the session
      passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
// config/passport.js
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // Passport Login
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        req.checkBody('email','Invalid Email').notEmpty().isEmail();
        req.checkBody('password','password cannot be empty').notEmpty().isLength({ min:4 });

        var errors = req.validationErrors();

        if (errors){
            var messages = [ ];
            errors.forEach(function(error){
                messages.push(error.msg);
            });

            return done(null,false,req.flash('error',messages));
        }
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, { message:'No User found.'}); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.comparePassword(password))
                return done(null, false, { message:'oops! wrong password.'}); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));
}
