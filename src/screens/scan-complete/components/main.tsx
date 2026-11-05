import { View } from 'react-native'
import { StepDevice } from './step-device'
import { StepInfo } from './step-info'
import { useMainViewModel } from '@scan-complete/view-model'

type MainProps = {
  deviceId: string
}

export const Main = ({ deviceId }: MainProps) => {
  const {
    state: { currentStep },
  } = useMainViewModel({ deviceId })
  return (
    <View>
      {currentStep === 0 && <StepDevice />}
      {currentStep === 1 && <StepInfo />}
    </View>
  )
}
