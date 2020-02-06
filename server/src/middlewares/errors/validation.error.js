import defaultError from './default.error';

export default (message = '') => {
  return defaultError({
    statusCode: 400,
    message: `Validation Error ${message}`,
  });
};
