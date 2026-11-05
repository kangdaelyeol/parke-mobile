import { themed } from '@/theme/themed'
import { ClassicDriveRecordScreen } from './drive-record-screen.classic'
import { GlassDriveRecordScreen } from './drive-record-screen.glass'

const DriveRecordScreen = themed({
  classic: ClassicDriveRecordScreen,
  'glass-dashboard': GlassDriveRecordScreen,
})

export default DriveRecordScreen
