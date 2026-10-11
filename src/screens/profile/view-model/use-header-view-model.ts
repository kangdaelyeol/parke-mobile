import { useNavigation } from '@react-navigation/native'
import { ProfileHeaderViewModel } from '@profile/types'

export const useHeaderViewModel = (): ProfileHeaderViewModel => {
  const navigation = useNavigation()

  const actions = {
    backPress: () => {
      navigation.goBack()
    },
  }
  return {
    state: {},
    actions,
  }
}
