function auth(req,res,next){
    console.log('Authenticating via exports module.');
    next();
}

module.exports.auth = auth;