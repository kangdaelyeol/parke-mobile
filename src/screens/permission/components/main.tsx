import { StyleSheet, Text, View } from 'react-native'
import { Item } from '@permission/components'
import { selectablePermissionItemList } from '@permission/config/main.config'
import { FONT } from '@/theme/fonts'

export const Main = () => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.section}>
          <View style={styles.title}>
            <Text style={styles.titleText}>필수적 접근 권한</Text>
          </View>
          <View style={styles.none}>
            <Text style={styles.noneText}>없음</Text>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.title}>
            <Text style={styles.titleText}>선택적 접근 권한</Text>
          </View>
          <View style={styles.list}>
            {selectablePermissionItemList.map(item => (
              <Item key={item.title} {...item} />
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
  },
  wrapper: {
    marginHorizontal: 'auto',
    width: '100%',
    maxWidth: 360,
  },
  section: {},
  title: {},
  titleText: {
    color: '#ffffff',
    fontFamily: FONT.MEDIUM,
    fontSize: 20,
  },
  none: {
    paddingVertical: 17,
    marginLeft: 18,
  },
  noneText: {
    color: '#c1c1c1',
    fontFamily: FONT.MEDIUM,
    fontSize: 14,
  },
  list: {
    gap: 15,
    marginTop: 20,
  },
})
