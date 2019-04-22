const LocalStrategy = require('passport-local').Strategy;
let encrypt = require('../encrypt/crypto').Encrypto;
let db = require('../database/db').Users;

module.exports = function (passport) 
{
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (usuario, done) {
        db.getUserData(usuario.idUser)
            .then(user => {
                done(null, user[0]);
            })
            .catch(err => console.log(err));
    });

    passport.use(new LocalStrategy({
        usernameField: 'persondata',
        passwordField: 'password'
    },
        (persondata, password, done) => {
            db.getUser({ userData: persondata})
                .then((user) => 
                {
                    if(user.length == 0)
                    {   
                        return done(null, false);
                    }

                    let result;
                    result = user[0];
                        
                    let isEqual = encrypt.ComparePassword(result.userPassword, password);

                    if(!isEqual)
                    {
                        return done(null, false);
                    }
                    else
                    {
                        return db.getUserData(result.idUser)
                    }
                })
                .then(resultado => {
                    return done(null, resultado[0]); 
                })
                .catch(err => {
                    return done(null, false);
                })
        }
    ));
}