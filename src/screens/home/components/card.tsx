import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { convertPhone } from '@/helpers'
import { CARD_HEIGHT, CARD_WIDTH } from '@home/constants'
import { useHomeCardViewModel } from '@/view-model'
import { HomeCardProps } from '@home/types'
import { DM_MONO, DM_SANS, PRETENDARD } from '@/theme/fonts'
import { Loading } from '@/components'

const BOTTOM_HEIGHT = 60
const TOP_HEIGHT = CARD_HEIGHT - BOTTOM_HEIGHT

const BUTTON_BACKGROUND = '#1c1c1c'
const BORDER_COLOR = '#2a2a2a'
const BORDER_COLOR_PRESSED = '#666'
const FONT_COLOR = '#666'
const FONT_COLOR_PRESSED = '#f0f0f0'

export const Card = ({ title, phone, idx, message, scan }: HomeCardProps) => {
  const { animated, actions, state } = useHomeCardViewModel(idx)

  return (
    <Pressable onPress={actions.cardPress}>
      <Animated.View style={[styles.container, animated.cardStyle]}>
        {state.loading && <Loading />}
        <View style={styles.wrapper}>
          <View style={styles.topSection}>
            <Text style={styles.brand}>Parké</Text>
            <Pressable>
              {({ pressed }) => (
                <View style={[styles.more, pressed && styles.optionBtnPressed]}>
                  <Text style={styles.moreText}>...</Text>
                </View>
              )}
            </Pressable>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.phone}>{convertPhone(String(phone))}</Text>
            <View style={styles.scan}>
              <View style={[scan ? styles.dotOn : styles.dotOff, styles.dot]} />
              <Text
                style={[
                  scan ? styles.scanTextOn : styles.scanTextOff,
                  styles.scanText,
                ]}
              >
                {scan ? '자동감지 On' : '자동감지 Off'}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          {state.settingCard === -1 && (
            <View style={styles.bottomSection}>
              <View style={styles.bottomLeft}>
                <Pressable onPress={actions.editPress}>
                  {({ pressed }) => (
                    <Text
                      style={[
                        styles.btn,
                        styles.optionBtn,
                        pressed && styles.optionBtnPressed,
                      ]}
                    >
                      수정
                    </Text>
                  )}
                </Pressable>
                <Pressable onPress={actions.previewPress}>
                  {({ pressed }) => (
                    <Text
                      style={[
                        styles.btn,
                        styles.optionBtn,
                        pressed && styles.optionBtnPressed,
                      ]}
                    >
                      미리보기
                    </Text>
                  )}
                </Pressable>
              </View>
              <View style={styles.bottomRight}>
                <Pressable onPress={actions.deletePress}>
                  {({ pressed }) => (
                    <Text
                      style={[
                        styles.btn,
                        styles.deleteBtn,
                        pressed && styles.deleteBtnPressed,
                      ]}
                    >
                      삭제
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 'auto',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#141414',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    overflow: 'hidden',
  },
  wrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  topSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: TOP_HEIGHT,
  },
  brand: {
    position: 'absolute',
    top: 15,
    left: 15,
    color: FONT_COLOR,
    fontFamily: DM_SANS.BOLD,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 11,
  },
  title: {
    position: 'absolute',
    bottom: 35,
    left: 17,
    fontSize: 22,
    fontFamily: DM_MONO.MEDIUM,
    color: '#f0f0f0',
  },
  message: {
    position: 'absolute',
    bottom: 10,
    right: 18,
    fontSize: 12,
    fontFamily: DM_MONO.MEDIUM,
    color: FONT_COLOR,
  },
  phone: {
    position: 'absolute',
    bottom: 25,
    right: 15,
    fontSize: 14,
    fontFamily: DM_MONO.MEDIUM,
    color: FONT_COLOR,
  },
  ellipsis: { color: FONT_COLOR },
  divider: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: BORDER_COLOR,
    bottom: BOTTOM_HEIGHT,
  },
  scan: {
    position: 'absolute',
    bottom: 15,
    left: 18,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  more: {
    backgroundColor: BUTTON_BACKGROUND,
    position: 'absolute',
    top: 13,
    right: 18,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  moreText: {
    color: FONT_COLOR,
    fontFamily: DM_MONO.MEDIUM,
    letterSpacing: -3,
    bottom: 3.5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
  },
  dotOn: {
    backgroundColor: '#44ff88',
    boxShadow: '0px 0px 6px #44ff88',
  },
  dotOff: {
    backgroundColor: '#ed3a3a',
    boxShadow: '0px 0px 6px #fa4c31',
  },
  scanText: {
    fontSize: 12,
    fontFamily: PRETENDARD.BOLD,
  },
  scanTextOn: {
    color: '#44ff88',
  },
  scanTextOff: {
    color: '#c02b2b',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_HEIGHT,
    flexDirection: 'row',
  },
  bottomLeft: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
    paddingLeft: 15,
  },
  btn: {
    fontSize: 13,
    paddingVertical: 9,
    borderRadius: 300,
    height: 35,
    marginVertical: 'auto',
    fontFamily: DM_SANS.BOLD,
    backgroundColor: BUTTON_BACKGROUND,
  },
  optionBtn: {
    color: FONT_COLOR,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 15,
  },
  optionBtnPressed: {
    color: FONT_COLOR_PRESSED,
    borderColor: BORDER_COLOR_PRESSED,
  },
  bottomRight: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  deleteBtn: {
    color: '#e05555',
    right: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: BUTTON_BACKGROUND,
  },
  deleteBtnPressed: {
    borderColor: '#e05555',
    backgroundColor: 'rgba(224,85,85,0.1)',
  },
})
