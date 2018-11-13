var express = require('express');
var router = express.Router();
var passport = require('passport');
var { getProgramByRollNumber, getInstitute } = require('../helpers/data');
var Matcher = require('../helpers/MatchMaker');
var axios = require('axios');

const isLoggedIn = (req) =>{
    if(req.user) {
        return true;
    }
    return false;

}

/* GET home page. */
router.get('/', async function(req, res, next) {
    if(!isLoggedIn(req))
        res.render('../views/index', { title: "Home" , loggedIn: false});
    else{
        let programs = await getProgramByRollNumber(req.user.RollNumber);
        res.render('../views/indexSignedIn', { title: "Home", programs , loggedIn: true});
    }
});

// Sign up
router.get('/signup', (req, res, next) => {
    res.render('../views/forms/signup', {title: "Sign Up", message: req.flash('signup'), loggedIn: isLoggedIn(req)});
})
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup'
}))

// Login
router.get('/login', (req, res, next) => {
    if(isLoggedIn(req)) {
        res.redirect('/');
    }
    else {
        res.render('../views/forms/login', {title: "Student Login", message: req.flash('login'), loggedIn: isLoggedIn(req)});
    }
})
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login'
}))

// Register For a Program
router.get('/register', async (req,res) => {
    let institutes = await getInstitute();
    res.render('registration', { title: "Registration", StudentRollNumber: req.user.RollNumber, institutes , loggedIn: isLoggedIn(req)});
});

// Logout
router.get('/logout', async (req, res) => {
    if(isLoggedIn(req)) {
        req.logout();
    }
    res.redirect('/');
})

router.post('/register', (req,res) => {
    axios.post(`http://localhost:3000/ProgramChosen`, req.body)
            .then(response => {
                res.redirect('/');
            })
});

// Result of the selection procedure.
router.get('/result', (req, res) => {
    // TODO
});

module.exports = router;
