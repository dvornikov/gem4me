const api = require('../api');
const isAuthenticated = require('../libs/isAuthenticated');

function action(req, res, next) {
  api(req)
  .request('/user/note', 'get')
  .then(response => {
    res.render('notes', { notes: response });
  })
  .catch(function(err) {
      next(err)
  });
};

module.exports = function(app) {
  app.route('/user/notes')
    .get(isAuthenticated, action);
};
