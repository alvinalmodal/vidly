const mongoose = require('mongoose');
const config = require('config');
const genreModelDebugger = require('debug')('app:genreModel');

mongoose.connect(
    // build mongodb server url.
    `${config.get('genre.serverPrefix')}${config.get('mongodb.username')}:${config.get('mongodb.password')}${config.get('genre.serverSuffix')}`,
    {useNewUrlParser:true,useUnifiedTopology:true}
)
.then(()=> {
    genreModelDebugger("Successfully connected to the database.");
})
.catch(() => {
    genreModelDebugger("Failed to connect to database.");
});

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
