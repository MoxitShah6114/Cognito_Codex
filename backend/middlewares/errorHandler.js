const errorHandler = (err, req, res, next) => {
    // Log to console for dev
    console.error(err.stack);
  
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Server Error';
  
    // MongoDB bad ObjectId
    if (err.name === 'CastError') {
      message = `Resource not found`;
      statusCode = 404;
    }
  
    // MongoDB duplicate key
    if (err.code === 11000) {
      message = `Duplicate field value entered`;
      statusCode = 400;
    }
  
    // MongoDB validation error
    if (err.name === 'ValidationError') {
      message = Object.values(err.errors).map(val => val.message).join(', ');
      statusCode = 400;
    }
  
    res.status(statusCode).json({
      success: false,
      message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  };
  
  module.exports = errorHandler;