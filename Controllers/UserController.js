//Importing all Required Libraries
var shortid = require('shortid');
var async = require('async');
var User = require('./../models/UserModel');
var request = require('request');

module.exports = { 

    

    getDash:function(req,res,next){

        res.render('users/dashboard');
    },

    logout:function(req,res,next){
        req.logout();
        req.flash('error','successfully logged out');
        res.redirect('/login');
        
    }



}
