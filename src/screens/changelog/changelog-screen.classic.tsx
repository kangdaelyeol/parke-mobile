import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { ChangeType } from '@/domain/app'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'
import {
  BLUE_PRIMARY,
  DARK,
  DARK_LIGHT,
  GRAY,
  GRAY_LIGHT,
  RED_LIGHT,
  WHITE,
} from '@/theme/color'
import { BUMP_LABEL, CHANGE_LABEL } from './labels'
import { useChangelogViewModel } from './view-model'

const CHANGE_COLOR: Record<ChangeType, string> = {
  feature: BLUE_PRIMARY,
  improve: GRAY_LIGHT,
  fix: RED_LIGHT,
}

// 변경 내역 (기본 테마: 처음 디자인의 설정 화면 모양)
export const ClassicChangelogScreen = () => {
  const { state, actions } = useChangelogViewModel()
  const { bottom } = useSafeAreaInsets()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={actions.backPress}>
          {({ pressed }) => (
            <FontAwesome6
              name="angle-left"
              iconStyle="solid"
              size={20}
              style={[styles.btn, pressed && styles.btnPressed]}
            />
          )}
        </Pressable>
        <Text style={styles.headerTitle}>버전 정보</Text>
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottom + 40 }]}
      >
        <View style={styles.current}>
          <Text style={styles.title}>현재 버전</Text>
          <Text style={styles.version}>
            {state.version} {state.stage}
          </Text>
        </View>
        {state.entries.map(entry => (
          <View key={entry.version} style={styles.section}>
            <Text style={styles.title}>
              v{entry.version} · {BUMP_LABEL[entry.bump]} · {entry.date}
            </Text>
            <View style={styles.card}>
              <Text style={styles.entryTitle}>{entry.title}</Text>
              {entry.changes.map((change, i) => (
                <View key={i} style={styles.change}>
                  <Text
                    style={[
                      styles.changeType,
                      { color: CHANGE_COLOR[change.type] },
                    ]}
                  >
                    {CHANGE_LABEL[change.type]}
                  </Text>
                  <Text style={styles.changeText}>{change.text}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    width: '100%',
    maxWidth: 360,
    marginHorizontal: 'auto',
    paddingBottom: 15,
  },
  headerTitle: {
    color: '#eeeeee',
    fontSize: 20,
    marginTop: 60,
    fontFamily: PRETENDARD.BOLD,
    textAlign: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 62,
    left: 0,
    zIndex: 3,
  },
  btn: {
    color: '#ebebeb',
  },
  btnPressed: {
    color: GRAY,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 10,
    marginHorizontal: 'auto',
  },
  current: {
    marginTop: 20,
    gap: 8,
  },
  version: {
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
    fontSize: 28,
  },
  section: {
    marginTop: 40,
  },
  title: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 15,
  },
  card: {
    marginTop: 15,
    padding: 16,
    gap: 12,
    backgroundColor: DARK,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: DARK_LIGHT,
  },
  entryTitle: {
    color: WHITE,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 15,
  },
  change: {
    flexDirection: 'row',
    gap: 10,
  },
  changeType: {
    width: 44,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 12,
    lineHeight: 20,
  },
  changeText: {
    flex: 1,
    color: GRAY_LIGHT,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
    lineHeight: 20,
  },
})
