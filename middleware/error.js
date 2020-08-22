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

    // check user ip.
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;

    // log exception
    const metadata = {
        url:req.url,
        method:req.method,
        ip,
        stackTrace: new Error(error.message).stack
    };
    log('error', error.message,{metadata});
    return res.status(500).send(error.message);
}