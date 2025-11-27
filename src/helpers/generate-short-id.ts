import { Buffer } from 'buffer';

export function generateBase64Id() {
  return Buffer.from(String(Date.now())).toString('base64');
}
