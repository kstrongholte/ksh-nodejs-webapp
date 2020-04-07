const dotenv = require('dotenv');
const expressSession = require('express-session');
//const cookieSession = require('cookie-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const express = require('express');
const http = require('http');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const userInViews = require('./lib/middleware/userInViews');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const expensesRouter = require('./routes/expenses');
const continueRouter = require('./routes/continue');
const verifyEmailRouter = require('./routes/verifyEmail');

const router = express.Router();

dotenv.config();

const auth0Strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
    connection: 'Username-Password-Authentication'
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    console.log(accessToken);
    return done(null, profile);
  }
);

passport.use(auth0Strategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const app = express();
const appUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT}`;

app.enable('trust proxy', true);
app.set('view engine', 'ejs');

const expressSess = {
  secret: 'this-is-express-secret',
  cookie: {},
  resave: false,
  saveUninitialized: true
};

app.use(expressSession(expressSess));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(userInViews());

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/', userRouter);
app.use('/', expensesRouter);
app.use('/', continueRouter);
app.use('/', verifyEmailRouter);

const PORT = process.env.PORT || 3000;
http.createServer(app).listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
