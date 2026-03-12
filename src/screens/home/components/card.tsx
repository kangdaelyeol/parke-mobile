import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { convertPhone } from '@/helpers'
import { CARD_HEIGHT, CARD_WIDTH } from '@home/constants'
import { useCardViewModel } from '@/view-model/home'
import { HomeCardProps } from '@home/types'
import { Loading } from '@/components'
import { CardBottomSheet } from '@home/components'
import { DM_MONO, DM_SANS, PRETENDARD } from '@/theme/fonts'
import {
  GRAY,
  WHITE,
  DARK,
  DARK_LIGHT,
  GREEN,
  RED,
  RED_LIGHT,
} from '@/theme/color'

const BOTTOM_HEIGHT = 60
const TOP_HEIGHT = CARD_HEIGHT - BOTTOM_HEIGHT

export const Card = ({ title, phone, idx, message, scan }: HomeCardProps) => {
  const { animated, actions, state } = useCardViewModel(idx)

  return (
    <Pressable onPress={actions.cardPress}>
      <Animated.View style={[styles.container, animated.cardStyle]}>
        {state.loading && <Loading />}
        <View style={styles.wrapper}>
          <View style={styles.topSection}>
            <Text style={styles.brand}>Parké</Text>
            <Pressable onPress={actions.morePress}>
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
              {scan ? (
                <Animated.View
                  style={[animated.scanOnDotStyle, styles.dot, styles.dotOn]}
                />
              ) : (
                <View style={[styles.dotOff, styles.dot]} />
              )}
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
      <CardBottomSheet
        modalRef={state.bottomSheetModalRef}
        title={title}
        phone={phone}
        scan={scan}
        idx={idx}
      />
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
    borderColor: DARK_LIGHT,
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
    color: GRAY,
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
    color: WHITE,
  },
  message: {
    position: 'absolute',
    bottom: 10,
    right: 18,
    fontSize: 12,
    fontFamily: DM_MONO.MEDIUM,
    color: GRAY,
  },
  phone: {
    position: 'absolute',
    bottom: 25,
    right: 15,
    fontSize: 14,
    fontFamily: DM_MONO.MEDIUM,
    color: GRAY,
  },
  ellipsis: { color: GRAY },
  divider: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: DARK_LIGHT,
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
    backgroundColor: DARK,
    position: 'absolute',
    top: 13,
    right: 18,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    borderWidth: 1,
    borderColor: DARK_LIGHT,
  },
  moreText: {
    color: GRAY,
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
    backgroundColor: GREEN,
    boxShadow: `0px 0px 6px ${GREEN}`,
  },
  dotOff: {
    backgroundColor: RED,
    boxShadow: `0px 0px 6px ${RED}`,
  },
  scanText: {
    fontSize: 12,
    fontFamily: PRETENDARD.BOLD,
  },
  scanTextOn: {
    color: GREEN,
  },
  scanTextOff: {
    color: RED,
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
    backgroundColor: DARK,
  },
  optionBtn: {
    color: GRAY,
    borderWidth: 1,
    borderColor: DARK_LIGHT,
    paddingHorizontal: 15,
  },
  optionBtnPressed: {
    color: WHITE,
    borderColor: GRAY,
  },
  bottomRight: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  deleteBtn: {
    color: RED_LIGHT,
    right: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: DARK,
  },
  deleteBtnPressed: {
    borderColor: RED_LIGHT,
    backgroundColor: 'rgba(224,85,85,0.1)',
  },
})
