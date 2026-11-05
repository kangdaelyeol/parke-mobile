import { StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { HomeStackNavigationProp } from '@/navigation/types'
import { SHOW_DRIVE_TEST_BUTTON } from '@/constants'
import { LogoIcon } from '@/assets/logo'
import { BrandBlock, GlassIconButton, StatusPill } from '@/components'
import { useBackgroundScanning } from '@/hooks'
import { useUserContext } from '@/contexts'
import { glassStyles } from '@/theme/glass'
import { formatPhone } from '@/utils'

// 홈 상단 바 (글래스): 영상의 상단 바 + 사이드바 맨 위 브랜드 묶음.
// 왼쪽은 로고 · 앱 이름 · 내 번호, 오른쪽은 스캔 상태. 본문과 같이 스크롤되어 올라간다
export const GlassTopBar = () => {
  const scanning = useBackgroundScanning()
  const navigation = useNavigation<HomeStackNavigationProp>()
  const { user } = useUserContext()

  return (
    <View style={[glassStyles.surface, styles.bar]}>
      <View style={styles.brand}>
        <BrandBlock
          title="Parké"
          caption={formatPhone(user?.phone || '')}
          logo={<LogoIcon width={17} height={22} />}
        />
      </View>
      {SHOW_DRIVE_TEST_BUTTON && (
        // [임시] 기기 없이 주행모드 테스트
        <GlassIconButton
          icon="car-side"
          size={34}
          onPress={() => navigation.navigate('Drive', {})}
        />
      )}
      <StatusPill
        dot
        tone={scanning ? 'success' : 'danger'}
        label={scanning ? '스캔 켜짐' : '스캔 꺼짐'}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    paddingRight: 12,
  },
  brand: {
    flex: 1,
  },
})
