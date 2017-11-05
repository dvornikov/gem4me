const api = require('../api');
const isAuthenticated = require('../libs/isAuthenticated');

// Получение профиля
function get(req, res, next) {
  api(req)
  .request('/user', 'get')
  .then(response => {
    res.render('profile', response);
  })
  .catch(function(err) {
      next(err)
  });
};

// Обновление профиля
function post(req, res, next) {
  req.checkBody({
    email: {
      notEmpty: {
        errorMessage: 'E-mail обязательное поле'
      },
      isEmail: {
        errorMessage: 'Поле E-mail должно быть действительным адресом'
      }
    },
  });

  let errors = req.validationErrors();
  if (errors) {
    res.render('profile', { errors: errors, ...req.body });
    return;
  }
  else {
    api(req)
    .request('/user', 'put', { token: req.session.token, ...req.body })
    .then(response => {
      res.render('profile', response);
    })
    .catch(function(err) {
      if (!err.status) next(err);
      let errors = [];
      switch (err.status) {
        case 409:
          errors.push({ msg: "Конфликт. Вероятно пользователь такой есть" })
          break;
        default:
      }
      res.render('profile', { errors: errors, ...req.body });
    });
  }
}

module.exports = function(app) {
  app.route('/user')
    .get(isAuthenticated, get)
    .post(isAuthenticated, post);
};
