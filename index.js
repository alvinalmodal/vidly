const startUpDebugger = require('debug')('app:startup');
const express = require('express');
const auth = require('./middleware/authenticate');
const morgan = require('morgan');
const helmet = require('helmet');
const home = require('./routes/home');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(helmet());

if(app.get('env') === 'development')
{
    app.use(morgan('tiny'));
    startUpDebugger('morgan enabled....');
} 

app.use(auth.auth);

// routes
app.use('/',home);
app.use('/api/v1/genres',genres);
app.use('/api/v1/customers',customers);
app.use('/api/v1/movies',movies);
app.use('/api/v1/rentals',rentals);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App running on ${port}`);
})