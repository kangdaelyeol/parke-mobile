import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useUserContext } from '@/contexts'
import { extractNumber } from '@/utils'
import { cardService, userService } from '@/services'
import { ScanCompleteStackNavigationProp } from '@/navigation/types'
import { ScanCompleteContextValue } from '@scan-complete/types'

const ScanCompleteContext = createContext({} as ScanCompleteContextValue)

export const ScanCompleteContextProvider = ({
  children,
}: PropsWithChildren) => {
  const { user, actions: userContextActions } = useUserContext()

  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [serial, setSerial] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [scanPage, setScanPage] = useState(false)
  const [serialInput, setSerialInput] = useState(false)
  const [serialScanned, setSerialScanned] = useState(false)
  const [deviceId, setDeviceId] = useState('')

  const navigation = useNavigation<ScanCompleteStackNavigationProp>()

  const actions = useMemo(
    () => ({
      phoneInput: (v: string) => {
        setPhone(extractNumber(v))
      },
      nameInput: (v: string) => {
        setName(v)
      },
      messageInput: (v: string) => {
        setMessage(v)
      },
      serialInput: (v: string) => {
        setSerial(v)
      },
      nextPress: () => {
        setCurrentStep(prev => prev + 1)
      },
      prevPress: () => {
        setCurrentStep(prev => prev - 1)
      },
      savePress: async () => {
        if (!user) return
        if (serial.trim() === '')
          return Alert.alert('시리얼 번호를 입력해주세요.')
        setLoading(true)

        const serialRes = await cardService.getAllow(serial.trim())
        if (!serialRes) {
          setLoading(false)
          return Alert.alert(
            '시리얼 번호 입력 오류',
            '시리얼 번호를 확인해주세요.',
          )
        }

        const cardRes = await cardService.create({
          id: serial,
          phone,
          message,
          title: name,
          scan: true,
          deviceId,
          userId: user.id,
          userNickname: user.nickname,
        })

        if (!cardRes) {
          Alert.alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
          return setLoading(false)
        }

        const newCardIdList = [...user.cardIdList, serial]

        const userRes = await userService.updateCardIdList(
          user.id,
          newCardIdList,
        )

        if (!userRes) {
          Alert.alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
          return setLoading(false)
        }

        userContextActions.addCardId(serial)

        Alert.alert('저장 성공!')
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
      },
      scanPress: () => {
        setScanPage(true)
      },
      scanBackPress: () => {
        setScanPage(false)
      },
      serialInputPress: () => {
        setSerialInput(true)
      },
      serialScan: (serialNum: string) => {
        setSerial(serialNum)
        setScanPage(false)
        setSerialScanned(true)
      },
      setDeviceId,
    }),
    [
      user,
      serial,
      phone,
      message,
      name,
      deviceId,
      userContextActions,
      navigation,
    ],
  )

  useEffect(() => {
    if (!serialScanned) return
    actions.savePress()
  }, [actions, serialScanned])

  const state = {
    phone,
    name,
    message,
    serial,
    currentStep,
    loading,
    scanPage,
    serialInput,
  }

  useEffect(() => {
    if (!user) return
    setPhone(user.phone)
    setName(`Parke${user.cardIdList.length + 1}`)
  }, [user, setPhone])

  return (
    <ScanCompleteContext.Provider value={{ state, actions }}>
      {children}
    </ScanCompleteContext.Provider>
  )
}

export const useScanCompleteContext = () => useContext(ScanCompleteContext)
