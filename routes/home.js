const api = require('../api');

module.exports = function(app) {
  app.get('/', (req, res, next) => {
    res.redirect('/user');
  });
};
