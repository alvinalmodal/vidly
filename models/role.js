const mongoose = require('../startup/db')('role');

const roleSchema = new mongoose.Schema({
    name: {
        type:String, 
        required:true,
        unique:true,
        minlength:2,
        maxlength:50
    }
},{strict:true});

const Role = mongoose.model('Role',roleSchema);

module.exports.roleSchema = roleSchema;
module.exports.Role = Role;