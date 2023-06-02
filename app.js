const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routers/userRouter');
app = express();

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/users', userRouter);
app.use('*', (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find the ${req.originalUrl}`
  });
  next();
});

module.exports = app;
