const exp = require('express');
const router = exp.Router();
let db = require("../database/db").Users;
let crypto = require('../encrypt/crypto').Encrypto;
const authenticate = require('connect-ensure-login');

router.get("/", authenticate.ensureLoggedOut('/'), (req, res) => {
    res.render('signup');
});

router.post("/", (req, res) => {
    let user = {
        userPassword: req.body.password,
        userData: req.body.persondata,
        nmUser: req.body.username
    }
    db.getUser(user)
        .then((users) => {
            if(users.length == 0)
            {
                user.userPassword = crypto.EncryptoPassword(user.userPassword);
                
                return db.insertUser(user);
            }
            else
            {
                res.json({ error: "Já existe um usuário com esse nome" });
            }
        })
        .then((dsds) => {
            res.json({sucess: 'sucesso'});
        })
        .catch(err => console.log(err));
});

module.exports = router;