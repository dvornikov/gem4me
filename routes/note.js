const api = require('../api');
const isAuthenticated = require('../libs/isAuthenticated');

function post(req, res, next) {
  req.checkBody({
    body: {
      notEmpty: {
        errorMessage: 'Поле &laquo;Заметка&raquo; обязательное поле'
      }
    },
  });

  let errors = req.validationErrors();
  if (errors) {
    res.render('note', { errors: errors, ...req.body });
    return;
  }
  else {
    api(req)
    .request('/user/note', 'post', { token: req.session.token, ...req.body })
    .then(response => {
      res.redirect('/user/notes');
    })
    .catch(function(err) {
        next(err)
    });
  }
};

function get(req, res, next) {
  res.render('note');
}

function remove(req, res, next) {
  api(req)
  .request('/user/note', 'delete', { token: req.session.token, ...req.params })
  .then(response => {
    res.redirect('/user/notes');
  })
  .catch(function(err) {
      next(err)
  });
}

module.exports = function(app) {
  app.route('/user/note')
    .get(isAuthenticated, get)
    .post(isAuthenticated, post);

  app.route('/user/note/:id')
    .get(isAuthenticated, get)
    .post(isAuthenticated, post);

  app.get('/user/note/:id/delete', isAuthenticated, remove)
};
