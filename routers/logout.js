const exp = require('express');
const router = exp.Router();
const authenticate = require('connect-ensure-login');

router.get("/", authenticate.ensureLoggedIn('/users/login'), (req, res) => {
    req.logout();
    res.redirect('/users/login');
});

module.exports = router;