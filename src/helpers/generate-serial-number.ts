import { Buffer } from 'buffer';
export const generateSerialNumber = () => {
  return Buffer.from(Date.now().toString(36)).toString('base64');
};
