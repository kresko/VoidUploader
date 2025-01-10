const db = require("../db/queryHandler");
const passport = require('passport');

async function renderLoginForm(req, res) {
    res.render('login');
}

async function loginUser(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.redirect('/');
        }

        req.login(user, (err) => {
            if (err) {
                return next(err);
            }

            return res.redirect('/');
        });
    })(req, res, next);
}

async function logoutUser(req, res, next) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}

async function renderRegisterForm(req, res) {
    res.render('register');
}

async function registerUser(req, res, next) {
    try {
        await db.registerUser(req.body);
        res.redirect('/');
    } catch(err) {
        return next(err);
    }
}

module.exports = {
    renderLoginForm,
    loginUser,
    logoutUser,
    renderRegisterForm,
    registerUser
}