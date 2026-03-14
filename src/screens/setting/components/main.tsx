import { StyleSheet, View, Text } from 'react-native'
import { useSettingMainViewModel } from '@/view-model/setting'
import { PRETENDARD } from '@/theme/fonts'
import { DARK, DARK_LIGHT, GRAY } from '@/theme/color'
import { Item } from '@setting/components'

export const Main = () => {
  const { state, actions } = useSettingMainViewModel()
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>일반</Text>
        <View style={styles.list}>
          <Item
            title="자동변경"
            subTitle="장치 감지시 자동 업데이트"
            option="autoChange"
            disabled={state.autoSetDisabled}
            value={state.autoSet}
            onValueChange={actions.autoSetChange}
          />
          <View style={styles.divider} />
          <Item
            title="알림"
            subTitle="푸시 알림 수신"
            option="notify"
            disabled={state.noticeDisabled}
            value={state.notice}
            onValueChange={actions.noticeChange}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>서비스</Text>
        <View style={styles.list}>
          <Item
            title="활성화"
            subTitle="서비스 활성화 상태"
            option="active"
            value={state.active}
            onValueChange={actions.activeChange}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 10,
    marginHorizontal: 'auto',
  },
  section: {
    marginTop: 40,
  },
  title: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 15,
  },
  list: {
    justifyContent: 'center',
    backgroundColor: DARK,
    borderRadius: 15,
    marginTop: 15,
    borderWidth: 1.5,
    borderColor: DARK_LIGHT,
  },
  divider: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: DARK_LIGHT,
    height: 1.5,
  },
})
