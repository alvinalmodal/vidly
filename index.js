const {port} = require('./config');
const error = require('./middleware/error');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

// load routes.
require('./startup/routes')(app);

// middleware to handle errors.
app.use(error);

app.listen(port, () => {
    console.log(`App running on ${port}`);
})