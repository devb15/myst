var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var LogSchema = new Schema({

    ip:{
        type:String
    },
    user_id:{ 
        type: Schema.ObjectId, 
        ref: 'User'
     },
    message:{
        type:String
    },
    logtime:{
        type:Date,
        default:Date.now()
    },
    useragent:{
        type:String
    }
  


}
);


module.exports = mongoose.model('Log',LogSchema);
