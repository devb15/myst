var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

// User Schema Model for MongoDB
var UserSchema = new Schema({

    name:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    phoneno:{
        type:Number,
        unique:true
    },
    status:{
        type:String,
        enum : ['active','banned'],
        default: 'active'
    },
    p_token:{
        type:String,
        default:null
    },
    p_tokenexpires:{
        type:String,
        default:null
    },
    balance:{
        type:Number
    },
    refcode:{
        type:String
    }

},
{   
    timestamps:true
}
);

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    var salt = bcrypt.genSaltSync(8);

    // hash the password using our new salt
    var hash = bcrypt.hashSync(user.password, salt);

     // override the cleartext password with the hashed one
    user.password = hash;
    next();
});


UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User',UserSchema);
