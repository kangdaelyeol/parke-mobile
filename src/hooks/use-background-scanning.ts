import { useSyncExternalStore } from 'react'
import { bleService } from '@/services'

// 백그라운드 스캔이 실제로 돌고 있는지
export const useBackgroundScanning = () =>
  useSyncExternalStore(bleService.subscribe, bleService.isBackgroundScanning)
