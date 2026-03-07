import { AnimatedViewModel, ViewModel } from '@/types/common'
import { StyleProp, ViewStyle } from 'react-native'
import { CameraDevice } from 'react-native-vision-camera'

interface ScanCompleteState {
  currentStep: number
}

export type ScanCompleteViewModel = ViewModel<ScanCompleteState, {}>

interface QrScanState {
  device: CameraDevice | undefined
  scanned: boolean
}

interface QrScanActions {
  codeScanner: {
    codeTypes: string[]
    onCodeScanned: (codes: any[]) => void
  }
  scanBackPress: ScanCompleteContextValue['actions']['scanBackPress']
}

export type ScanCompleteQrScanViewModel = ViewModel<QrScanState, QrScanActions>

export interface ScanCompleteContextValue {
  actions: {
    phoneInput: (v: string) => void
    nameInput: (v: string) => void
    messageInput: (v: string) => void
    serialInput: (v: string) => void
    nextPress: () => void
    savePress: () => Promise<void>
    prevPress: () => void
    scanPress: () => void
    scanBackPress: () => void
    serialInputPress: () => void
    serialScan: (v: string) => void
    setDeviceId: React.Dispatch<React.SetStateAction<string>>
  }
  state: {
    phone: string
    name: string
    message: string
    serial: string
    currentStep: number
    loading: boolean
    scanPage: boolean
    serialInput: boolean
  }
}

interface StepLineAnimated {
  lineStyle: StyleProp<ViewStyle>
}

export type ScanCompleteStepLineViewModel = AnimatedViewModel<
  {},
  {},
  StepLineAnimated
>

export interface ScanCompleteStepLineViewModelProps {
  step: number
}

export interface StepLineProps {
  step: number
}

interface StepNodeState {
  currentStep: number
}

interface StepNodeAnimated {
  dotStyle: StyleProp<ViewStyle>
  checkIconStyle: StyleProp<ViewStyle>
}

export type ScanCompleteStepNodeViewModel = AnimatedViewModel<
  StepNodeState,
  {},
  StepNodeAnimated
>

export interface ScanCompleteStepNodeViewModelProps {
  step: number
}
