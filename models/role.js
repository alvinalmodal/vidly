const {mongoDbUrl} = require('../config');
const mongoose = require('mongoose');
const roleModelDebugger = require('debug')('app:roleModel');

mongoose.connect(
    `${mongoDbUrl}`,
    {useNewUrlParser:true,useUnifiedTopology:true}
)
.then(()=> {
    roleModelDebugger("Successfully connected to the database.");
})
.catch(() => {
    roleModelDebugger("Failed to connect to database.");
});

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