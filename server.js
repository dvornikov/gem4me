// framework. решил Express, т.к. помню что он легок в плане старта для
// программиста.
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const {
  loginForm,
  loginUser,
  registerForm,
  registerUser,
  resetPasswordForm,
  changePasswordForm,
  partnersList,
  profileForm
} = require('./controllers/user');

app.set('view engine', 'pug');
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressValidator());
app.use(session({
  secret: 'Gem4me',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.get('/register', registerForm);
app.post('/register', registerUser);
app.get('/user', profileForm);
app.get('/login', loginForm);
app.post('/login', loginUser);
app.get('/user/changePassword', changePasswordForm);
app.get('/user/resetPassword', resetPasswordForm);

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});
