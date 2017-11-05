const api = require('../api');
const isAuthenticated = require('../libs/isAuthenticated');

function action(req, res, next) {
  req.checkBody({
    oldPassword: {
      notEmpty: {
        errorMessage: 'Поле &laquo;Текущий пароль&raquo; обязательное поле'
      }
    },
    newPassword: {
      notEmpty: {
        errorMessage: 'Поле &laquo;Новый пароль&raquo; обязательное поле'
      }
    },
  });

  let errors = req.validationErrors();
  if (errors) {
    res.render('change-password', { errors: errors, ...req.body });
    return;
  }
  else {
    api(req)
    .request('/user/changePassword', 'post', { token: req.session.token, ...req.body })
    .then(response => {
      res.redirect('/user');
    })
    .catch(function(err) {
      if (!err.status) next(err);
      let errors = [];
      switch (err.status) {
        case 400:
          errors.push({ msg: "ошибки в параметрах" })
          break;
        case 404:
          errors.push({ msg: "пользователь не найден" })
          break;
        case 409:
          errors.push({ msg: "пользователь с таким username или email существует уже" })
          break;
        default:
      }
      res.render('change-password', { errors: errors, ...req.body });
    });
  }
};

module.exports = function(app) {
  app.route('/user/changePassword')
    .get(isAuthenticated, (req, res, next) => res.render('change-password'))
    .post(isAuthenticated, action);
};
