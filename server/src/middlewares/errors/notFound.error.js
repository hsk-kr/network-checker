import defaultError from './default.error';

export default name => {
  return defaultError({ statusCode: 404, message: `Not Found ${name}` });
};
