// 기기 배터리 상태: 양호(50% 이상) / 보통(20% 이상) / 부족
export type BatteryStatus = 'good' | 'fair' | 'low'

export const batteryStatus = (level: number): BatteryStatus => {
  if (level >= 50) return 'good'
  if (level >= 20) return 'fair'
  return 'low'
}
