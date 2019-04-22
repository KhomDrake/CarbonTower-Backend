var express = require('express');
var router = express.Router();
let db = require("../database/db").Campeonato;

const authenticate = require('connect-ensure-login');

router.get('/', authenticate.ensureLoggedIn('/users/login'), function(req, res, next) {
  let user = req.session.passport.user;
  console.log(user);
  if(user.nmRole == "Empresa") 
  {
    res.render('campeonato');
  }
  else 
  {
    db.getCampeonatosParticipo(user.idUser)
    .then(resultado => {
      console.log(resultado);
      res.render('index');
    })
    .catch(err => console.log(err));
  }
  
});

module.exports = router;
