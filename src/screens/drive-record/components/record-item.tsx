import { themed } from '@/theme/themed'
import { ClassicRecordItem } from './record-item.classic'
import { GlassRecordItem } from './record-item.glass'

export const RecordItem = themed({
  classic: ClassicRecordItem,
  'glass-dashboard': GlassRecordItem,
})
