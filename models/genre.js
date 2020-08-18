const mongoose = require('../startup/db')('genre');

const genreSchema = new mongoose.Schema({
    name: {
        type:String, 
        required:true,
        minlength:5,
        maxlength:50
    }
},{strict:true});

const Genre = mongoose.model('Genre',genreSchema);

module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
