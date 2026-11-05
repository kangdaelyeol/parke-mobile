import { themed } from '@/theme/themed'
import { ClassicDriveRecordsScreen } from './drive-records-screen.classic'
import { GlassDriveRecordsScreen } from './drive-records-screen.glass'

const DriveRecordsScreen = themed({
  classic: ClassicDriveRecordsScreen,
  'glass-dashboard': GlassDriveRecordsScreen,
})

export default DriveRecordsScreen
