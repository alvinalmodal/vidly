const log = require('../startup/logger');

// handles uncaught exceptions.
process.on('uncaughtException', (error) => {
    console.log(`Unhandled exception : ${error.message}`);
    const metadata = {
        stackTrace: new Error(error.message).stack
    };
    log('error', error.message,{metadata});
});

// handles uncaught rejected promises and throws it as an uncaught exception.
process.on('unhandledRejection', (ex) => {
    throw ex;
});

module.exports = function(error, req, res, next){
    // log exception
    const metadata = {
        url:req.url,
        method:req.method,
        ip:req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        stackTrace: new Error(error.message).stack
    };
    log('error', error.message,{metadata});
    return res.status(500).send(error.message);
}