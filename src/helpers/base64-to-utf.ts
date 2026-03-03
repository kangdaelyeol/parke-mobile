import { Buffer } from 'buffer';
export const base64ToUtf = (b64str: string): string => {
  return Buffer.from(b64str, 'base64').toString('utf8');
};
