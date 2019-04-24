var express = require('express');
var router = express.Router();
let db = require("../database/db").Campeonato;

const authenticate = require('connect-ensure-login');

module.exports = router;