var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors')
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./middlewares/logger');
const isAuthenticated = require('./middlewares/user_auth');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
})

var indexRouter = require('./routes/index');
var taskRouter = require('./routes/task')
var typesRouter = require('./routes/types');
var authRouter = require('./routes/auth');

var app = express();

app.use(limiter);
app.use(logger);


app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/auth', authRouter);
app.use(isAuthenticated);

app.use('/', indexRouter);
app.use('/task', taskRouter);
app.use('/types', typesRouter);

module.exports = app;
