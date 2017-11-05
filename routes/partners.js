const api = require('../api');
const isAuthenticated = require('../libs/isAuthenticated');

function action(req, res, next) {
  api(req)
  .request('/user/personalPartners', 'get')
  .then(response => {
    res.render('partners', response);
  })
  .catch(function(err) {
      next(err)
  });
};

module.exports = function(app) {
  app.route('/user/personalPartners')
    .get(isAuthenticated, action);
};
