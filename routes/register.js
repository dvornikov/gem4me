const api = require('../api');

function action(req, res, next) {
  req.checkBody({
    sponsor: {
      notEmpty: {
        errorMessage: 'Логин cпонсора обязательное поле'
      },
      matches: {
        options: /^(?![\-_]+)[a-z0-9\-_]+?(?:[^\-_]+)$/,
        errorMessage: 'Логин cпонсора может содержать латинские буквы (a-z), цифры (0-9), &laquo;-&raquo; и &laquo;_&raquo;, но не может начинаться с &laquo;-&raquo; и &laquo;_&raquo; или заканчиваться ими.'
      }
    },
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
    res.render('register', { errors: errors, ...req.body });
    return;
  }
  else {
    api(req)
    .request('/user', 'post', req.body)
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
        case 409:
          errors.push({ msg: "пользователь с таким username или email существует уже" })
          break;
        default:
      }
      res.render('profile', { errors: errors, ...req.body });
    });
  }
};

module.exports = function(app) {
  app.route('/register')
    .get((req, res, next) => res.render('register'))
    .post(action);
};
