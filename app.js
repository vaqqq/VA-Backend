const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const helmet = require('helmet');
const https = require('https');
require('dotenv').config();

const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const companyRouter = require('./routes/register-company');
const userRouter = require('./routes/user');
const timeRouter = require('./routes/addTime');
const projectRouter = require('./routes/addProject');
const getProjectRouter = require('./routes/getProject');
const getCompanyRouter = require('./routes/getCompany');
const employeeRouter = require('./routes/addEmployee');

mongoose.connect(process.env.MONGODBURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'"],
    imgSrc: ["'self'"],
    connectSrc: ["'self'"],
    objectSrc: ["'none'"],
  },
})); 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.set('trust proxy', true);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/user', userRouter);
app.use('/api/register-company', companyRouter);
app.use('/api/users', timeRouter);
app.use('/api/users', projectRouter);
app.use('/api/users', getProjectRouter);
app.use('/api/users', getCompanyRouter);
app.use('/api/users', employeeRouter);

app.use((req, res, next) => {
  if (req.hostname === 'max-va.vercel.app' && req.path === '/') {
    res.redirect('/'); 
  } else {
    next();
  }
});

module.exports = app;