import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native'
import { useMainViewModel } from '@/view-model/setting'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'
import { DARK, DARK_LIGHT, GRAY, GRAY_DEEP } from '@/theme/color'
import { Item, ItemDivider, ItemList } from '@/components'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'

export const Main = () => {
  const { state, actions } = useMainViewModel()
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.title}>일반</Text>
          <ItemList>
            <Item
              title="자동변경"
              subTitle="장치 감지시 자동 업데이트"
              option="bluetooth"
              disabled={state.autoSetDisabled}
              value={state.autoSet}
              onValueChange={actions.autoSetChange}
            />
            <ItemDivider />
            <Item
              title="알림"
              subTitle="푸시 알림 수신"
              option="notify"
              disabled={state.noticeDisabled}
              value={state.notice}
              onValueChange={actions.noticeChange}
            />
          </ItemList>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>서비스</Text>
          <ItemList>
            <Item
              title="활성화"
              subTitle="서비스 활성화 상태"
              option="active"
              value={state.active}
              onValueChange={actions.activeChange}
            />
          </ItemList>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>약관 및 정책</Text>
          <View style={styles.termSection}>
            <Pressable onPress={actions.privacyPress} style={styles.termLine}>
              <Text style={styles.termText}>개인정보 처리방침</Text>
              <FontAwesome6
                name="angle-right"
                size={14}
                iconStyle="solid"
                style={styles.angle}
              />
            </Pressable>
            <Pressable onPress={actions.termsPress} style={styles.termLine}>
              <Text style={styles.termText}>서비스 이용약관</Text>
              <FontAwesome6
                name="angle-right"
                size={14}
                iconStyle="solid"
                style={styles.angle}
              />
            </Pressable>

            <Pressable onPress={actions.consentPress} style={styles.termLine}>
              <Text style={styles.termText}>개인정보 수집·이용</Text>
              <FontAwesome6
                name="angle-right"
                size={14}
                iconStyle="solid"
                style={styles.angle}
              />
            </Pressable>

            <Pressable
              onPress={actions.consentThirdPress}
              style={styles.termLine}
            >
              <Text style={styles.termText}>개인정보 제3자 제공</Text>
              <FontAwesome6
                name="angle-right"
                size={14}
                iconStyle="solid"
                style={styles.angle}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>버전</Text>
          <View style={styles.termSection}>
            <View style={styles.termLine}>
              <Text style={styles.termText}>1.0.0 Beta</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
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
  termSection: {
    marginTop: 17,
    gap: 10,
  },
  termLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  termText: {
    color: GRAY_DEEP,
    fontFamily: DM_SANS.MEDIUM,
    fontSize: 15,
  },
  angle: {
    color: GRAY_DEEP,
  },
})
