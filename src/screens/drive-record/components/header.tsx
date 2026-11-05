import { StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GlassIconButton } from '@/components'
import { DriveRecordHeaderProps } from '@/screens/drive-record/types'
import { PRETENDARD } from '@/theme/fonts'
import { TEXT } from '@/theme/glass'

// 뒤로 가기(유리 원형 버튼) + 제목
export const Header = ({ title, onBack }: DriveRecordHeaderProps) => {
  const { top } = useSafeAreaInsets()
  return (
    <View style={[styles.wrapper, { paddingTop: top + 14 }]}>
      <GlassIconButton round size={36} icon="chevron-left" onPress={onBack} />
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
    paddingHorizontal: 18,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    flexShrink: 1,
    color: TEXT.primary,
    fontSize: 20,
    fontFamily: PRETENDARD.BOLD,
    letterSpacing: -0.3,
  },
})
