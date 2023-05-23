const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routers/userRouter');
app = express();

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/users', userRouter);

module.exports = app;
