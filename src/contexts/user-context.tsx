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
import { CardState } from '@/services/types'

const isUserDto = (v: any): v is UserDto => {
  return v !== null
}

interface SyncSuccess<T> {
  status: true
  payload: T
}

interface SyncFailure {
  status: false
  message: string
}

type SyncResponse<T> = SyncSuccess<T> | SyncFailure

interface UserContextValue {
  cards: CardState[]
  user: UserDto | null
  syncCardList: () => Promise<SyncResponse<null>>
  validateUser: () => Promise<SyncResponse<UserDto>>
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

const userContext = createContext({} as UserContextValue)

export const UserContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserDto | null>({
    id: 'uss',
    nickname: 'rkdeofuf',
    phone: '01024130510',
    cardIdList: [],
  })

  const [cards, setCards] = useState<CardState[]>([])
  const [stateSession, setStateSession] = useState(0)

  const validateUser = useCallback(async (): Promise<SyncResponse<UserDto>> => {
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

  const syncCardList = useCallback(async (): Promise<SyncResponse<null>> => {
    const validationRes = await validateUser()
    if (!validationRes.status) return validationRes

    const userNow = validationRes.payload

    const cardIdList = userNow.cardIdList || []

    const isCardListSynced =
      cardIdList.length === cards.length &&
      cardIdList.every(id => cards.some(card => card.id === id))

    if (cardIdList.length === 0 || isCardListSynced)
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
        if (!user) return
        const newCardIdList = [...user?.cardIdList, cardId]
        return setUser(prev => {
          if (isUserDto(prev)) return { ...prev, cardIdList: newCardIdList }
          else return null
        })
      },
      deleteCard: (cardId: string) => {
        const filteredCardList = cards.filter(card => card.id !== cardId)
        setCards(filteredCardList)
        setUser(prev => {
          if (isUserDto(prev))
            return {
              ...prev,
              cardIdList: filteredCardList.map(card => card.id),
            }
          else return prev
        })
      },
      setUserNicknameAndPhone: (nickname: string, phone: string) => {
        if (!user) return
        setUser(prev => {
          if (isUserDto(prev)) return { ...prev, nickname, phone }
          else return null
        })
      },
      updateCardPhone: (cardId: string, phone: string) => {
        setCards(prev =>
          prev.map(card => (card.id !== cardId ? card : { ...card, phone })),
        )
      },
      setCardScan: (cardId: string, scan: boolean) => {
        setCards(prev =>
          prev.map(card => {
            if (card.id !== cardId) return card
            return { ...card, scan }
          }),
        )
      },
      updateCardInfo: (
        cardId: string,
        title: string,
        phone: string,
        message: string,
      ) => {
        setCards(prev => {
          const index = cards.findIndex(cd => cd.id === cardId)
          const newCards = [...prev]
          newCards[index] = {
            ...cards[index],
            title,
            phone,
            message,
          }
          return newCards
        })
      },
      initUser: (dto: UserDto) => {
        setUser(dto)
      },
    }),
    [cards, user],
  )

  return (
    <userContext.Provider
      value={{
        stateSession,
        cards,
        user,
        syncCardList,
        validateUser,
        actions,
      }}
    >
      {children}
    </userContext.Provider>
  )
}

export const useUserContext = () => useContext(userContext)
