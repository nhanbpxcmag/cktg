import * as bcrypt from 'bcrypt';
var crypto = require('crypto');

const saltRounds = 10;

const cryptoPassword = (password: string, salt_password: string): string => {
  const hash = crypto
    .pbkdf2Sync(password, salt_password, 1000, 64, `sha512`)
    .toString(`hex`);
  return hash;
};

export const hashPassword = async (
  password: string,
  salt_password: string,
): Promise<string> => {
  const cryptoPass = cryptoPassword(password, salt_password);
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(cryptoPass, salt);
};
export const comparePassword = async (
  password: string,
  passwordHash: string,
  salt_password: string,
): Promise<boolean> => {
  const cryptoPass = cryptoPassword(password, salt_password);
  return await bcrypt.compareSync(cryptoPass, passwordHash, salt_password);
};
