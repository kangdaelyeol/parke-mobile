import { StyleSheet, Text, View } from 'react-native'
import { BLUE_PRIMARY, DARK, DARK_LIGHT, GRAY, WHITE } from '@/theme/color'
import { DM_SANS } from '@/theme/fonts'

// 기본 테마 미리보기: 어두운 카드 + 파란 숫자·토글·버튼 (처음 디자인)
export const ClassicPreview = () => (
  <View style={styles.preview}>
    <View style={styles.panel}>
      <Text style={styles.label}>BLE 감지</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>128</Text>
        <Text style={styles.unit}>회</Text>
      </View>
    </View>
    <View style={[styles.panel, styles.grow]}>
      <View style={styles.toggleRow}>
        <Text style={styles.label}>자동변경</Text>
        <View style={styles.toggle}>
          <View style={styles.knob} />
        </View>
      </View>
      <View style={styles.button}>
        <Text style={styles.buttonText}>주행모드</Text>
      </View>
    </View>
  </View>
)

const styles = StyleSheet.create({
  preview: {
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#000000',
  },
  panel: {
    padding: 10,
    gap: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: DARK_LIGHT,
    backgroundColor: DARK,
  },
  grow: {
    flex: 1,
    justifyContent: 'space-between',
  },
  label: {
    color: GRAY,
    fontFamily: DM_SANS.BOLD,
    fontSize: 11,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  value: {
    color: '#2d25ff',
    fontFamily: DM_SANS.BOLD,
    fontSize: 20,
  },
  unit: {
    color: GRAY,
    fontFamily: DM_SANS.BOLD,
    fontSize: 11,
    marginBottom: 3,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggle: {
    width: 30,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3b3bf9',
    justifyContent: 'center',
  },
  knob: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 16,
    backgroundColor: '#e5e5e5',
  },
  button: {
    height: 24,
    borderRadius: 8,
    backgroundColor: BLUE_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
    fontSize: 11,
  },
})
