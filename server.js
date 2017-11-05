const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');

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
  saveUninitialized: true
}));
app.use(function(req, res, next){
    res.locals.errors = req.session.errors;
    delete req.session.errors;
    next();
});

require('./routes/login')(app);
require('./routes/logout')(app);
require('./routes/register')(app);
require('./routes/reset-password')(app);
require('./routes/change-password')(app);
require('./routes/partners')(app);
require('./routes/profile')(app);
require('./routes/notes')(app);
require('./routes/note')(app);
require('./routes/home')(app);

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});
