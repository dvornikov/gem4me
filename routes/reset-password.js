const api = require('../api');

function action(req, res, next) {
  req.checkBody({
    username: {
      notEmpty: {
        errorMessage: 'Поле &laquo;Логин&raquo; обязательное поле'
      }
    }
  });

  let errors = req.validationErrors();
  if (errors) {
    res.render('reset-password', { errors: errors, ...req.body });
    return;
  }
  else {
    api(req)
    .request('/user/resetPassword', 'post', req.body)
    .then(response => {
      res.redirect('/login');
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
        default:
      }
      res.render('reset-password', { errors: errors, ...req.body });
    });
  }
};

module.exports = function(app) {
  app.route('/user/resetPassword')
    .get((req, res, next) => res.render('reset-password'))
    .post(action);
};
