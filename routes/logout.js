const api = require('../api');

module.exports = function(app) {
  app.get('/logout', (req, res, next) => {
    req.session.destroy(err => res.redirect('/login'))
  });
};
