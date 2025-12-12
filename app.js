require('dotenv').config();
const express = require('express');
const path = require('node:path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const pool = require('./db/pool');

const indexRouter = require('./routes/indexRouter');
const signUpRouter = require('./routes/signUpRouter');
const logInRouter = require('./routes/logInRouter');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Session setup
app.use(
  session({
    store: new pgSession({ pool, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    },
  })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// Flash failure or success messages
app.use(flash());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE username = $1;',
        [username]
      );
      user = rows[0];

      if (!user) {
        return done(null, false, { message: 'Incorrect Username!' });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect Password!' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/sign-up', signUpRouter);
app.use('/log-in', logInRouter);
app.get('/log-out', (req, res) => {
  req.logOut((error) => {
    if (error) {
      return next(error);
    }
    res.redirect('/');
  });
});

// Unknown route
app.use((req, res, next) => {
  const error = new Error('Could not find the requested page.');
  error.statusCode = 404;
  next(error);
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).render('index', {
    errors: [{ msg: err.message }],
  });
});

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`App running on port ${PORT}`);
});
