var express = require('express');
var router = express.Router();
let db = require("../database/db").Campeonato;

const authenticate = require('connect-ensure-login');

router.post('/signup', authenticate.ensureLoggedIn('/users/login'), function(req, res, next) {
    let user = req.session.passport.user;
    db.insertCampeonato({ name: req.body.username, owner: user.idRole, game: req.body.games})
        .then(resultado => {
            res.redirect('/')
        })  
});

router.get("/get", authenticate.ensureLoggedIn('/users/login'), (req, res) => {
    let user = req.session.passport.user;
    db.getCampeonatosEmpresa(user.idUser)
        .then(resultado => {
            res.json(resultado);
        })
});

router.get("/detail/:id", authenticate.ensureLoggedIn('/users/login'), (req, res) => {
    let user = req.session.passport.user;
    console.log(user.idUser);
    console.log(user.idUserRole);
    console.log(req.params.id);
    db.getCampeonatoEmpresa(user.idUser, user.idUserRole, req.params.id)
        .then(campeonato => {
            if(campeonato.length == 0) {
                res.redirect("/");
            }
            else 
            {
                let information = {
                    nmChampionship: campeonato[0].nmChampionship,
                    nmGame: campeonato[0].nmGame,
                    nmUser: campeonato[0].nmUser,
                    idChampionship: campeonato[0].idChampionship
                }
                console.log(information);
                res.render("campeonato-detalhes", information);
            }
        })
});

router.get("/:id/players", authenticate.ensureLoggedIn('/users/login'), (req, res) => {
    let user = req.session.passport.user;
    db.getPlayersChampionship(req.params.id, user.idUserRole)
        .then(players => {
            console.log(players);
            res.json(players);
        })
});

router.post("/invite/:id/create", authenticate.ensureLoggedIn('/users/login'), (req, res) => {
    let user = req.session.passport.user;

    if(user.nmRole != "Empresa") {
        res.redirect(`/campeonato/detail/${req.params.id}`);
    }

    db.insertInvite(req.params.id, req.body.cpf)
        .then(resultado => {
            res.redirect(`/campeonato/detail/${req.params.id}`);
        })
        .catch(error => {
            console.log(error);
            res.redirect(`/campeonato/detail/${req.params.id}`);
        })
});

router.get("/invite/:id/accept", authenticate.ensureLoggedIn('/users/login'), (req, res) => {
    let user = req.session.passport.user;

    if(user.nmRole != "Jogador") {
        res.redirect(`/`);
    }

    db.acceptedInvite(req.params.id, user.idUser)
        .then(resultado => {
            res.redirect("/")
        });
});

router.get("/invite/:id/refuse", authenticate.ensureLoggedIn('/users/login'), (req, res) => {
    let user = req.session.passport.user;

    if(user.nmRole != "Jogador") {
        res.redirect(`/`);
    }

    db.refuseInvite(req.params.id, user.idUser)
        .then(resultado => {
            res.redirect("/")
        });
});

router.get("/invite/get", authenticate.ensureLoggedIn('/users/login'), (req, res) => {
    let user = req.session.passport.user;
    db.getInvitePlayer(user.idUser)
        .then(invites => {
            res.json(invites);
        });
});

module.exports = router;