const api = require('../api');

module.exports.loginForm = function(req, res) {
    res.render('login');
};

module.exports.registerForm = function (req, res) {
  res.render('register');
};

module.exports.loginUser = function(req, res, next) {
    api(req)
    .request('/auth', 'GET', null, req.body)
    .then(response => {
        if (response.status === 200) {
            res.redirect('/user');
        }
        else {
            console.log(response);
            res.redirect('/register');
        }
    })
    .catch(function(err) {
        console.log(err);
        next(err);
    });
};

module.exports.registerUser = function (req, res, next) {
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

    errors = req.validationErrors();
    if (errors) {
      console.log(errors);
      res.render('register', { errors: errors });
      return;
    }
    else {
      api(req)
      .request('/user', 'post', req.body)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        else {
          let error = new Error(response.status)
          return Promise.reject(error);
        }
      })
      .then(response => {
        console.log(response);
        req.session.token = response.token;
        res.redirect('/user');
      })
      .catch(function(err) {
          // console.log(err);
          res.redirect('/register');
          // next(err)
      });
    }
};

// Восстановление пароля: Форма
module.exports.resetPasswordForm = function (req, res, next) {
    res.render('reset-password');
};

// Восстановление пароля: Обработка
module.exports.resetPasswordAction = function (req, res, next) {
    api(req)
    .request('/user/resetPassword', 'post', {...req.body, token: req.session.token })
    .then(response => {
        if (response.status === 200) {
            res.redirect('/user');
        }
        else {
            res.redirect('/register');
        }
    })
    .catch(function(err) {
        console.log(err);
        next(err)
    });
};


// Восстановление пароля: Форма
module.exports.resetPasswordForm = function (req, res, next) {
    res.render('reset-password');
};

// Восстановление пароля: Обработка
module.exports.resetPasswordAction = function (req, res, next) {
    api(req)
    .request('/user/resetPassword', 'post', req.body)
    .then(response => {
        if (response.status === 200) {
            res.redirect('/user');
        }
        else {
            res.redirect('/register');
        }
    })
    .catch(function(err) {
        console.log(err);
        next(err)
    });
};

// Сменя пароля: Форма
module.exports.changePasswordForm = function (req, res, next) {
    res.render('change-password');
};

// Сменя пароля: Обработка
module.exports.changePasswordAction = function (req, res, next) {
    api(req)
    .request('/user/changePassword', 'post', req.body)
    .then(response => {
        if (response.status === 200) {
            res.redirect('/user');
        }
        else {
            res.redirect('/register');
        }
    })
    .catch(function(err) {
        console.log(err);
        next(err)
    });
};


// Профиль пользователя: Форма
module.exports.profileForm = function (req, res, next) {
    res.render('profile');
};

// Профиль пользователя: Обработка
module.exports.profileAction = function (req, res, next) {
    api(req)
    .request('/user/changePassword', 'put', req.body)
    .then(response => {
        if (response.status === 200) {
            res.redirect('/user');
        }
        else {
            res.redirect('/register');
        }
    })
    .catch(function(err) {
        console.log(err);
        next(err)
    });
};


// Партнеры
module.exports.partnersList = function (req, res, next) {
    res.render('partners');
};


// Заметки
module.exports.noteList = function (req, res, next) {
    res.render('notes');
};

module.exports.noteForm = function (req, res, next) {
    res.render('note');
};
