const mongoose = require('mongoose');
const config = require('config');
const { ref } = require('joi');
const movieModelDebugger = require('debug')('app:movieModel');
const {genreSchema} = require('./../models/genre');

mongoose.connect(config.get('movie.server'),{useNewUrlParser:true,useUnifiedTopology:true})
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
    genre:{type:genreSchema,required:true},
    numberInStock:{
        type:Number,
        default:0
    },
    dailyRentalRate:{type:Number,default:0}
},{strict:true});

const Movie = mongoose.model("Movie",movieSchema);

module.exports.Movie = Movie;
module.exports.movieSchema = movieSchema;

