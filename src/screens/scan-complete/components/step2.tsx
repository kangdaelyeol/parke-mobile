import { StyleSheet, Text, View } from 'react-native'
import { FocusableInput, Item, ItemList } from '@/components'
import { useScanCompleteContext } from '@/contexts/scan-complete-context'
import { DM_SANS } from '@/theme/fonts'
import { WHITE } from '@/theme/color'

export const Step2 = () => {
  const { actions, state } = useScanCompleteContext()
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>
          Parké의 QR코드를 스캔하거나{'\n'} 제품의 시리얼 번호를 입력해주세요
        </Text>
        <ItemList>
          <Item
            title="QR코드 스캔하기"
            subTitle="카메라로 제품의 QR코드를 인식합니다"
            option="qr"
            onPress={actions.scanPress}
          />
        </ItemList>

        <View style={styles.serialInputSection}>
          {state.serialInput ? (
            <FocusableInput
              title="시리얼 번호"
              value={state.serial}
              onChangeText={actions.serialInput}
              placeholder="시리얼 번호"
              iconName="my"
            />
          ) : (
            <ItemList>
              <Item
                title="시리얼 번호 입력하기"
                subTitle="제품 하단의 시리얼 번호를 직접 입력합니다"
                option="serial"
                onPress={actions.serialInputPress}
              />
            </ItemList>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  wrapper: {
    width: '100%',
    maxWidth: 360,
    marginHorizontal: 'auto',
  },
  title: {
    marginTop: 30,
    marginBottom: 15,
    color: WHITE,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: DM_SANS.BOLD,
  },
  serialInputSection: {
    marginTop: 10,
  },
})
