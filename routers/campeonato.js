var express = require('express');
var router = express.Router();
let db = require("../database/db").Campeonato;

const authenticate = require('connect-ensure-login');

router.post('/signup', authenticate.ensureLoggedIn('/users/login'), function(req, res, next) {
    let user = req.session.passport.user;
    console.log(req.body);
    db.insertCampeonato({ name: req.body.username, owner: user.idRole, game: req.body.games})
        .then(resultado => {
            res.render('campeonato')
        })  
});

router.get("/get", authenticate.ensureLoggedIn('/users/login'), (req, res) => {
    let user = req.session.passport.user;
    db.getCampeonatosParticipo(user.idUser)
        .then(resultado => {
            res.json(resultado);
        })
});

module.exports = router;