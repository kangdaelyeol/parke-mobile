import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { UserDto } from '@/domain/user/user-dto'
import { authService, cardService, userService } from '@/services'
import { CardState, ServiceResponse } from '@/services/types'

interface UserContextValue {
  cards: CardState[]
  setCards: React.Dispatch<React.SetStateAction<CardState[]>>
  user: UserDto | null
  syncCardList: () => Promise<ServiceResponse<null>>
  validateUser: () => Promise<ServiceResponse<UserDto>>
  stateSession: number
  actions: {
    addCardId: (serial: string) => void
    deleteCard: (cardId: string) => void
    setUserNicknameAndPhone: (nickname: string, phone: string) => void
    updateCardPhone: (cardId: string, phone: string) => void
    setCardScan: (cardId: string, scan: boolean) => void
    updateCardInfo: (
      cardId: string,
      title: string,
      phone: string,
      message: string,
    ) => void
    initUser: (dto: UserDto) => void
    refreshStateSession: () => void
  }
}

const userContext = createContext<UserContextValue | null>(null)

export const UserContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserDto | null>({
    id: '',
    nickname: '',
    phone: '',
    cardIdList: [],
  })

  const [cards, setCards] = useState<CardState[]>([])
  const [stateSession, setStateSession] = useState(0)

  const validateUser = useCallback(async (): Promise<
    ServiceResponse<UserDto>
  > => {
    if (!user) {
      authService.signOut()
      return { status: false, message: '유저 정보가 없습니다.' }
    }
    const userRes = await userService.getUser(user.id)
    if (!userRes.status) {
      authService.signOut()
      return { status: false, message: userRes.message }
    }
    if (userRes.payload === null) {
      authService.signOut()
      return { status: false, message: '유저 정보를 불러오는데 실패했습니다.' }
    }
    return { status: true, payload: userRes.payload }
  }, [user])

  const syncCardList = useCallback(async (): Promise<ServiceResponse<null>> => {
    const validationRes = await validateUser()
    if (!validationRes.status) return validationRes

    const userNow = validationRes.payload

    console.log(userNow)

    const cardIdList = userNow.cardIdList || []

    const isCardListSync =
      cardIdList.length === cards.length &&
      cardIdList.every(id => cards.some(card => card.id === id))

    if (cardIdList.length === 0 || isCardListSync)
      return { status: true, payload: null }

    const cardListRes = await cardService.getList(userNow.cardIdList || [])
    if (!cardListRes.status)
      return {
        status: false,
        message:
          'uset context - syncCardList: 카드 정보를 불러오는데 실패했습니다.',
      }

    setCards(cardListRes.payload || [])
    setUser(userNow)
    return { status: true, payload: null }
  }, [cards, validateUser])

  const actions = useMemo(
    () => ({
      refreshStateSession: () => setStateSession(prev => prev + 1),
      addCardId: (cardId: string) => {
        setUser(prev =>
          prev ? { ...prev, cardIdList: [...prev.cardIdList, cardId] } : prev,
        )
      },
      deleteCard: (cardId: string) => {
        setCards(prev => prev.filter(card => card.id !== cardId))
        setUser(prev =>
          prev
            ? {
                ...prev,
                cardIdList: prev.cardIdList.filter(id => id !== cardId),
              }
            : prev,
        )
      },
      setUserNicknameAndPhone: (nickname: string, phone: string) => {
        setUser(prev => (prev ? { ...prev, nickname, phone } : prev))
      },
      updateCardPhone: (cardId: string, phone: string) => {
        setCards(prev =>
          prev.map(card => (card.id !== cardId ? card : { ...card, phone })),
        )
      },
      setCardScan: (cardId: string, scan: boolean) => {
        setCards(prev =>
          prev.map(card => (card.id !== cardId ? card : { ...card, scan })),
        )
      },
      updateCardInfo: (
        cardId: string,
        title: string,
        phone: string,
        message: string,
      ) => {
        setCards(prev =>
          prev.map(card =>
            card.id !== cardId ? card : { ...card, title, phone, message },
          ),
        )
      },
      initUser: (dto: UserDto) => {
        setUser(dto)
      },
    }),
    [],
  )

  const value = useMemo(
    () => ({
      stateSession,
      cards,
      setCards,
      user,
      syncCardList,
      validateUser,
      actions,
    }),
    [stateSession, cards, user, syncCardList, validateUser, actions],
  )

  return <userContext.Provider value={value}>{children}</userContext.Provider>
}

export const useUserContext = () => {
  const context = useContext(userContext)
  if (!context)
    throw new Error('useUserContext must be used within UserContextProvider')
  return context
}
