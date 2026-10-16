import { Pressable, StyleSheet, Text, View } from 'react-native'
import { JSX } from 'react/jsx-runtime'
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { Toggle } from '@home/components'
import { useCardViewModel } from '@home/view-model'
import { Loading } from '@/components'
import { formatPhone } from '@/utils'
import { DM_MONO, DM_SANS, PRETENDARD } from '@/theme/fonts'
import { RED_LIGHT } from '@/theme/color'
import { BluetoothIllustration, PhoneIllustration } from './illustrations'

interface BottomSheetProps {
  idx: number
  title: string
  phone: string
  scan: boolean
  modalRef: React.RefObject<BottomSheetModal | null>
}

const BORDER_COLOR = '#2a2a2a'
const BORDER_COLOR_PRESSED = '#666'
const FONT_COLOR = '#666'

const renderBackdrop = (
  props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps,
) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
    pressBehavior="close"
  />
)

export const CardBottomSheet = ({
  idx,
  title,
  phone,
  scan,
  modalRef,
}: BottomSheetProps) => {
  const { actions, state } = useCardViewModel(idx)

  const editPress = () => {
    modalRef.current?.dismiss()
    actions.editPress()
  }

  // 삭제가 끝날 때까지 시트를 열어 두고 로딩을 보여준다
  const deletePress = () => {
    actions.deletePress(() => modalRef.current?.dismiss())
  }

  return (
    <BottomSheetModal
      enablePanDownToClose={true}
      ref={modalRef}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.backgroundStyle}
      handleIndicatorStyle={styles.indicatorStyle}
    >
      <BottomSheetView style={styles.container}>
        {state.loading && <Loading />}
        <View style={styles.header}>
          <View style={styles.headerDescription}>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.phone}>{formatPhone(phone)}</Text>
          </View>
          <View style={styles.scanState}>
            <View style={[styles.dot, scan ? styles.dotOn : styles.dotOff]} />
            <Text
              style={[
                styles.scanText,
                scan ? styles.scanTextOn : styles.scanTextOff,
              ]}
            >
              {scan ? '자동감지 On' : '자동감지 Off'}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.optionContainer}>
          <Pressable onPress={actions.scanChangePress}>
            {({ pressed }) => (
              <View style={[styles.option, pressed && styles.optionPressed]}>
                <View style={styles.optionLeft}>
                  <View style={[styles.optionIcon, styles.scanIcon]}>
                    <BluetoothIllustration size={25} />
                  </View>
                  <View style={styles.descriptionSection}>
                    <Text style={styles.descriptionTitle}>자동감지</Text>
                    <Text style={styles.description}>
                      BLE 감지 시 변경 시도
                    </Text>
                  </View>
                </View>
                <View style={styles.optionRight}>
                  <Toggle scan={scan} />
                </View>
              </View>
            )}
          </Pressable>
          <Pressable onPress={actions.changePhonePress}>
            {({ pressed }) => (
              <View style={[styles.option, pressed && styles.optionPressed]}>
                <View style={styles.optionLeft}>
                  <View style={[styles.optionIcon, styles.changePhoneIcon]}>
                    <PhoneIllustration size={20} />
                  </View>
                  <View style={styles.descriptionSection}>
                    <Text style={styles.descriptionTitle}>내 번호로 변경</Text>
                    <Text style={styles.description}>
                      현재 노출 번호를 내 번호로
                    </Text>
                  </View>
                </View>
                <View style={styles.optionRight}>
                  <Text style={styles.changeArrow}>›</Text>
                </View>
              </View>
            )}
          </Pressable>
        </View>
        <View style={[styles.optionContainer, styles.manageContainer]}>
          <Pressable onPress={editPress}>
            {({ pressed }) => (
              <View style={[styles.option, pressed && styles.optionPressed]}>
                <View style={styles.optionLeft}>
                  <View style={[styles.optionIcon, styles.editIcon]}>
                    <FontAwesome6
                      iconStyle="solid"
                      name="pen"
                      size={17}
                      color="#9db4ff"
                    />
                  </View>
                  <View style={styles.descriptionSection}>
                    <Text style={styles.descriptionTitle}>카드 수정</Text>
                    <Text style={styles.description}>
                      이름·번호·메시지·테마 변경
                    </Text>
                  </View>
                </View>
                <View style={styles.optionRight}>
                  <Text style={styles.changeArrow}>›</Text>
                </View>
              </View>
            )}
          </Pressable>
          <Pressable onPress={deletePress}>
            {({ pressed }) => (
              <View
                style={[styles.option, pressed && styles.deleteOptionPressed]}
              >
                <View style={styles.optionLeft}>
                  <View style={[styles.optionIcon, styles.deleteIcon]}>
                    <FontAwesome6
                      iconStyle="solid"
                      name="trash-can"
                      size={17}
                      color={RED_LIGHT}
                    />
                  </View>
                  <View style={styles.descriptionSection}>
                    <Text style={[styles.descriptionTitle, styles.deleteTitle]}>
                      카드 삭제
                    </Text>
                    <Text style={styles.description}>
                      내 목록에서 삭제 (재등록 가능)
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundStyle: {
    backgroundColor: '#141414',
    borderTopColor: '#2a2a2a',
    borderWidth: 1,
  },
  indicatorStyle: {
    backgroundColor: '#fff',
  },
  bottomSheetOption: {
    fontFamily: DM_SANS.MEDIUM,
    fontSize: 20,
    color: '#eee',
    paddingVertical: 20,
  },
  header: {
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerDescription: {
    gap: 5,
  },
  headerTitle: {
    color: '#f0f0f0',
    fontFamily: DM_SANS.BOLD,
    fontSize: 16,
  },
  phone: {
    color: FONT_COLOR,
    fontFamily: DM_MONO.MEDIUM,
  },
  scanState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: BORDER_COLOR,
  },
  optionContainer: {
    width: '100%',
    paddingTop: 30,
    gap: 10,
  },
  manageContainer: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  option: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    marginHorizontal: 'auto',
    backgroundColor: '#1c1c1c',
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionPressed: {
    borderColor: BORDER_COLOR_PRESSED,
  },
  optionLeft: {
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanIcon: {
    backgroundColor: 'rgba(68,255,136,0.1)',
  },
  changePhoneIcon: {
    backgroundColor: 'rgba(232,240,96,0.1)',
  },
  editIcon: {
    backgroundColor: 'rgba(56,59,249,0.15)',
  },
  deleteIcon: {
    backgroundColor: 'rgba(224,85,85,0.1)',
  },
  deleteTitle: {
    color: RED_LIGHT,
  },
  deleteOptionPressed: {
    borderColor: RED_LIGHT,
  },
  descriptionSection: {
    gap: 2,
  },
  descriptionTitle: {
    color: '#f0f0f0',
    fontFamily: DM_SANS.BOLD,
    fontSize: 15,
  },
  description: {
    color: FONT_COLOR,
    fontFamily: DM_SANS.MEDIUM,
    fontSize: 12,
  },
  optionRight: {
    justifyContent: 'center',
  },
  changeArrow: {
    color: FONT_COLOR,
    fontSize: 20,
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
})
