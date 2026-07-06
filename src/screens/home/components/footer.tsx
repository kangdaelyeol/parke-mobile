import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { FooterIcon } from '@home/components'
import { HomeStackNavigationProp } from '@/navigation/types'
import { footerIconList } from '@home/config/footer.config'
import { DARK } from '@/theme/color'

export const Footer = () => {
  const navigation = useNavigation<HomeStackNavigationProp>()
  const { width } = useWindowDimensions()

  const isSmall = width < 400

  return (
    <View style={[styles.container, isSmall && styles.containerSmall]}>
      <View style={[styles.wrapper, isSmall && styles.wrapperSmall]}>
        {footerIconList.map(icon => (
          <FooterIcon
            iconSize={isSmall ? 20 : 27}
            key={icon.key}
            iconName={icon.iconName}
            label={icon.label}
            onPress={() => navigation.navigate(icon.key)}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: DARK,
    height: 90,
    borderColor: '#2d2d2d',
    borderTopWidth: 1,
  },
  containerSmall: {
    height: 60,
  },
  wrapper: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 30,
    paddingTop: 10,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapperSmall: { paddingHorizontal: 30, paddingTop: 5 },
})
