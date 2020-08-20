const mongoose = require('mongoose');
const dbDebugger = require('debug')('app:db');

module.exports = function(dbName) {
    mongoose.connect(
        // build mongodb server url.
        `${process.env.MONGODB_URL}`,
        {useNewUrlParser:true,useUnifiedTopology:true}
    )
    .then(()=> {
        dbDebugger(`Successfully connected to the ${dbName} database.`);
    })
    .catch(() => {
        dbDebugger(`Failed to connect to ${dbName}  database.`);
    });

    return mongoose;
}

