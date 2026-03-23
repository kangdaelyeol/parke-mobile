import { Buffer } from 'buffer'

export const base64ToUtf = (b64str: string): string => {
  return Buffer.from(b64str, 'base64').toString('utf8')
}

export const generateSerialNumber = () => {
  return Buffer.from(Date.now().toString(36)).toString('base64')
}

export const getBatteryLevel = (manufacturer: string): string => {
  const buf = Buffer.from(manufacturer, 'base64')
  return String(buf[10])
}

export const getDeviceId = (manufacturer: string) => {
  return Buffer.from(manufacturer, 'base64').toString('utf8').slice(2, 10) // 8 length
}
