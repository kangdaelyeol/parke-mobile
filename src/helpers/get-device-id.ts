import { Buffer } from 'buffer'

export const getDeviceId = (manufacturer: string) => {
  return Buffer.from(manufacturer, 'base64').toString('utf8').slice(2, 10) // 8 length
}
