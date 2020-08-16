const {mongoDbUrl} = require('../config');
const mongoose = require('mongoose');
const movieModelDebugger = require('debug')('app:movieModel');

mongoose.connect(
    // build mongodb server url.
    `${mongoDbUrl}`,
    {useNewUrlParser:true,useUnifiedTopology:true}
)
.then(()=> {
    movieModelDebugger("Successfully connected to the database.");
})
.catch(() => {
    movieModelDebugger("Failed to connect to database.");
});

const movieSchema = new mongoose.Schema({
    title: {
        type:String, 
        required:true,
        minlength:3,
        maxlength:500
    },
    genre:{
        type: new mongoose.Schema({
            _id:{
                type:String,
                required:true
            },
            name:{
                type:String,
                required:true
            }
        }),
        required:true
    },
    numberInStock:{
        type:Number,
        default:0,
        min:0
    },
    dailyRentalRate:{
        type:Number,
        default:0,
        min:0
    }
},{strict:true});

const Movie = mongoose.model("Movie",movieSchema);

module.exports.Movie = Movie;
module.exports.movieSchema = movieSchema;

