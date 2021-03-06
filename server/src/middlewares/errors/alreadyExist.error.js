import defaultError from './default.error';

export default name => {
  return defaultError({ statusCode: 400, message: `${name} already exists` });
};
