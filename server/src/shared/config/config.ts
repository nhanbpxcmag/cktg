import { DEVELOPMENT } from './../../constants';
import * as Joi from 'joi';

const schema = Joi.object({
  NODE_ENV: Joi.string()
    .allow('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(4040),
  JWT_SECRET: Joi.string()
    .required()
    .description('JWT Secret required to sign'),
  JWT_EXPIRESIN: Joi.any().default('30 days'),
  SALT_PASSWORD: Joi.string()
    .required()
    .description('salt password required to sign'),
  MONGODB_URI: Joi.string().required().description('Mongo DB host url'),
  MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false),
  }),
  SESSION_SECRET: Joi.string()
    .required()
    .description('Session Secret required to sign'),
})
  .unknown()
  .required();

const { error, value: envVars } = schema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  salt_password: envVars.SALT_PASSWORD,
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresin: envVars.JWT_EXPIRESIN,
  },
  mongodb: {
    uri: envVars.MONGODB_URI,
  },
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  sessionSecret: envVars.SESSION_SECRET,
  development: envVars.NODE_ENV === DEVELOPMENT ? true : false,
};

export default config;
