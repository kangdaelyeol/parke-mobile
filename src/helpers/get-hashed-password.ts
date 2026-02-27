import cryptoJs from 'crypto-js';
export const getHashedPassword = (v: string): string => {
  return cryptoJs.SHA256('parke:' + v).toString();
};
