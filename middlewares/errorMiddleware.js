const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message ? err.message : 'Internal Server Error';
    
    // Log error details in development environments
    if (process.env.NODE_ENV === 'development') {
        console.error('ERROR 💥:', err);
    }

    // Send stack trace in development but hide in production
    res.status(status).json({
        status: status === 500 ? 'error' : 'fail',
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Stack only in development
    });
};

module.exports = errorMiddleware;
