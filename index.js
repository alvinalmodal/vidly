const startUpDebugger = require('debug')('app:startup');
const express = require('express');
const auth = require('./middleware/authenticate');
const morgan = require('morgan');
const helmet = require('helmet');
const home = require('./routes/home');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
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



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App running on ${port}`);
})