var compression = require('compression')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var frameguard = require('frameguard');
var logger = require('morgan');
var config = require('config');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

global.lib = require('./lib');
global.messages = require('./messages')
global.USER_ROLE_ID = 2;
global.ADMIN_ROLE_ID = 5;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


var index = require('./routes/index');
var user = require('./routes/user.server.routes');
var department = require('./routes/department.server.routes');
var user_role = require('./routes/user_role.server.routes');
var auth = require('./routes/auth.server.routes');


var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
global.mongoskin = require('mongoskin');
var db = require('./db/db');
var User = db.import('./models/user');
var Sequelize = require('sequelize');

var sessionStore = new MongoStore({
    host: config.mongo.host,
    port: config.mongo.port,
    db: config.mongo.db,
    url: config.mongo.url
});

app.disable('etag');
/*creating express session*/

app.use(frameguard({
    action: 'deny'
}));

app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: '3478129048712904871239084',
    cookie: {
        maxAge: 365 * 24 * 60 * 60 * 1000
    },
    store: sessionStore
        /*store: new MongoStore({
            db: global.db
        })*/
}));

app.use(function (req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
res.setHeader('Access-Control-Allow-Credentials', true);
next();
});


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', express.static(path.resolve(__dirname, 'public')));



app.use('/', index);
app.use('/user', user);
app.use('/department', department);
app.use('/user_role', user_role);
app.use('/auth', auth);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(compression({
    filter: shouldCompress
}))

function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }
    // fallback to standard filter function
    return compression.filter(req, res)
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


/*Create ADMIN for system if not exists*/
User.findOne({
    where: {
        user_role_id: ADMIN_ROLE_ID
    }
}).then(function(adminObj) {
    if (!adminObj) {
        console.log('creating admin');
        var token = global.lib.getToken();
        var admin = {
            f_name: 'admin',
            user_role_id: ADMIN_ROLE_ID,
            email: 'admin@liquidity.com',
            password: global.lib.getSaltedPassword('liquidity@123'),
            token: token.token,
            email_verification: true,
            token_issued_on: token.issued_on,
            token_expires_on: token.expires_on
        }
        User.create(admin).catch(function(err) {
            console.log(err.stack);
            process.exit();
        })
    }
}).catch(function(err) {
    console.log(err);
    process.exit();
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
