var express = require('express');
var router = express.Router();
let db = require("../database/db").Campeonato;


const authenticate = require('connect-ensure-login');

router.post('/signup', authenticate.ensureLoggedIn('/users/login'), function(req, res, next) {
    let user = req.session.passport.user;
    console.log(user);
    db.insertCampeonato({ nome: req.body.username, campeonatoOwner: user.idUserPaper })
        .then(resultado => {
            res.render('campeonato')
        })  
});

module.exports = router;