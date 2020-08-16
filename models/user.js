const {mongoDbUrl} = require('../config');
const {roleSchema} = require('./role');
const mongoose = require('mongoose');
const userModelDebugger = require('debug')('app:userModel');

mongoose.connect(
    // build mongodb server url.
    `${mongoDbUrl}`,
    {useNewUrlParser:true,useUnifiedTopology:true}
)
.then(()=> {
    userModelDebugger("Successfully connected to the database.");
})
.catch(() => {
    userModelDebugger("Failed to connect to database.");
});

const userSchema = new mongoose.Schema({
    name: {
        type:String, 
        required:true,
        minlength:2,
        maxlength:70
    },
    email:{
        type:String,
        unique:true,
        minlength:3,
        maxlength:255,
        required:true
    },
    password:{
        type:String,
        maxlength:1024,
        required:true
    },
    roles:{
        type:[roleSchema],
        validate: v => Array.isArray(v) && v.length > 0,
        message: 'User should have at least one role.'
    },
},{strict:true});

const User = mongoose.model('User',userSchema);

module.exports.userSchema = userSchema;
module.exports.User = User;