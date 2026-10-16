import { StyleSheet, Text, View } from 'react-native'
import { DriveStatProps } from '@/screens/drive/types'
import { GRAY, WHITE } from '@/theme/color'
import { DM_MONO, PRETENDARD } from '@/theme/fonts'

export const DriveStat = ({ label, value, unit }: DriveStatProps) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.valueRow}>
      <Text style={styles.value}>{value}</Text>
      {!!unit && <Text style={styles.unit}>{unit}</Text>}
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 4,
  },
  label: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 12,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  value: {
    color: WHITE,
    fontFamily: DM_MONO.MEDIUM,
    fontSize: 18,
  },
  unit: {
    color: GRAY,
    fontFamily: DM_MONO.MEDIUM,
    fontSize: 12,
  },
})
