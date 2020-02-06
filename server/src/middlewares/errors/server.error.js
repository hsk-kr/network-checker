import defaultError from './default.error';

export default () => {
  return defaultError({ statusCode: 500, message: 'Server Error' });
};
