module.exports = {
    ensureAuth: function (req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/');
        }
    },

    // ensure guest is to ensure that if you are logged in and you try to go the login page
    // i dont want you to see the login

    ensureGuest: function (req, res, next){
        if(req.isAuthenticated()){
            res.redirect('/dashboard');
        } else {
            return next();
        }
    }
}