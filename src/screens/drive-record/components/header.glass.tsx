import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GlassTitleBar } from '@/components'
import { DriveRecordHeaderProps } from '@/screens/drive-record/types'

// 주행 기록 머리 (글래스): 제목도 유리 막대 안에, 왼쪽에 ‹
export const GlassHeader = ({ title, onBack }: DriveRecordHeaderProps) => {
  const { top } = useSafeAreaInsets()
  return (
    <View style={[styles.wrapper, { paddingTop: top + 8 }]}>
      <GlassTitleBar title={title} onBack={onBack} />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
    paddingHorizontal: 14,
    paddingBottom: 4,
  },
})
