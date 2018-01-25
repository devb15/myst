var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ServiceSchema = new Schema({

    name:{
        type:String
    },
    img_url:{
        type:String
    },
    body:{
        type:String
    },
    price:{
        type:Number
    }


});

module.exports = mongoose.model('Service',ServiceSchema);