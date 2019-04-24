let exp = require("express");
let app = exp();
let path = require('path');
let cors = require('cors');

let passport = require('passport');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(exp.json());
let session = require('express-session');

let auth = require('./auth/auth')(passport);

app.use(cors());
app.use(exp.urlencoded({ extended: false }));
app.use(session({
  secret: 'my express secret',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(exp.static(path.join(__dirname, '/public/')));

app.use('/', require('./routers/index'));
app.use('/users/login', require('./routers/login'));
app.use('/users/signup', require('./routers/signup'));
app.use('/logout', require('./routers/logout'));
app.use('/campeonato', require('./routers/campeonato'));
app.use('/player', require('./routers/player'));
app.use('/data', require('./routers/data'));

module.exports = app;