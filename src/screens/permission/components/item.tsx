import { StyleSheet, Text, View } from 'react-native'
import { PRETENDARD } from '@/theme/fonts'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'

interface props {
  icon: any
  title: string
  description: string
  iconStyle: any
}

export const Item = ({ icon, title, description, iconStyle }: props) => {
  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <FontAwesome6
          name={icon}
          size={25}
          iconStyle={iconStyle}
          style={styles.icon}
        />
      </View>
      <View style={styles.textGroup}>
        <View style={styles.title}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.description}>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    borderWidth: 1,
    borderColor: '#ffffff',
    marginLeft: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: '#ffffff',
  },
  imageText: {
    color: '#ffffff',
  },
  textGroup: {
    marginLeft: 24,
    gap: 3,
  },
  title: {},
  titleText: { color: '#cccccc', fontFamily: PRETENDARD.MEDIUM, fontSize: 14 },
  description: {},
  descriptionText: {
    color: '#a0a0a0',
    fontFamily: PRETENDARD.REGULAR,
    fontSize: 12,
  },
})
