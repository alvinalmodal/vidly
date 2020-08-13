const startUpDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const express = require('express');
const auth = require('./authenticate');
const morgan = require('morgan');
const helmet = require('helmet');
const home = require('./routes/home');
const genres = require('./routes/genres');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(helmet());

// routes
app.use('/',home);
app.use('/api/v1/genres',genres);

if(app.get('env') === 'development')
{
    app.use(morgan('tiny'));
    startUpDebugger('morgan enabled....');
} 

// db debugger
dbDebugger('Connected to the database...');

app.use(auth.auth);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App running on ${port}`);
})