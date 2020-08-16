const {port,mongoDbUrl} = require('./config');
const startUpDebugger = require('debug')('app:startup');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const home = require('./routes/home');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const users = require('./routes/users');
const tokens = require('./routes/tokens');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const roles = require('./routes/roles');
const {auth} = require('./middleware/authenticate');
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

// routes
app.use('/',home);
app.use('/api/v1/genres',genres);
app.use('/api/v1/customers',auth(['administrator']),customers);
app.use('/api/v1/movies',movies);
app.use('/api/v1/rentals',rentals);
app.use('/api/v1/users',users);
app.use('/api/v1/tokens',tokens);
app.use('/api/v1/roles',roles);

app.listen(port, () => {
    console.log(`App running on ${port}`);
})