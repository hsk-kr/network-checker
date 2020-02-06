export default (err, req, res, next) => {
  // TODO: Handling server error (500)
  console.log('error-information');
  console.log(err);

  if (err && err.statusCode && err.message) {
    const { statusCode, message } = err;

    return res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
    });
  }

  return next();
};
