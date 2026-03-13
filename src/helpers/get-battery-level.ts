import { Buffer } from 'buffer'
export const getBatteryLevel = (manufacturer: string): string => {
  const buf = Buffer.from(manufacturer, 'base64')
  return String(buf[10])
}
