module.exports = function(req, res, next) {
    if (req.session && req.session.token) {
      res.locals.isUser = true;
      return next();
    }

    req.session.errors = [{
      msg: "Вам нужно войти в систему"
    }];

    res.redirect('/login');
}
