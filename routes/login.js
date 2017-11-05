const api = require('../api');

function action(req, res, next) {
  req.checkBody({
    username: {
      notEmpty: {
        errorMessage: 'Логин обязательное поле'
      }
    },
    password: {
      notEmpty: {
        errorMessage: 'Пароль обязательное поле'
      }
    }
  });

  let errors = req.validationErrors();
  if (errors) {
    res.render('login', { errors: errors, ...req.body });
    return;
  }
  else {
    api(req)
    .request('/auth', 'GET', null, req.body)
    .then(response => {
        req.session.token = response.token;
        req.session.save(err => res.redirect('/user'));
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
        case 401:
          errors.push({ msg: "refusal of authorization" })
          break;
        default:
      }
      res.render('login', { errors: errors, ...req.body });
    });
  }
}

module.exports = function(app) {
  app.route('/login')
    .get((req, res, next) => res.render('login'))
    .post(action);
};
