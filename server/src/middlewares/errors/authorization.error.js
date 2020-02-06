import defaultError from './default.error';

export default () => {
  return defaultError({ statusCode: 401, message: 'Authorization Error' });
};
