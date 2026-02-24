import { Alert } from 'react-native';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
import { CardDto } from '@/domain/card/card-dto';
import { UserDto } from '@/domain/user/user-dto';
import { cardService } from '@/services';

const isCardList = (v: any): v is CardDto[] => {
  return v !== null;
};

interface UserContextValueType {
  cards: CardDto[];
  user: UserDto;
  setUser: React.Dispatch<React.SetStateAction<UserDto>>;
  setCards: React.Dispatch<React.SetStateAction<CardDto[]>>;
  syncCardList: () => Promise<void>;
}

const userContext = createContext({} as UserContextValueType);

export const UserContextProvider = ({ children }: PropsWithChildren) => {
  // temp data
  const [user, setUser] = useState<UserDto>({
    id: 'uss',
    nickname: 'rkdeofuf',
    phone: '01024130510',
    cardIdList: [],
  });

  // temp data
  const [cards, setCards] = useState<CardDto[]>([]);

  const syncCardList = useCallback(async () => {
    const cardList = await cardService.getList(user.cardIdList || []);
    if (!isCardList(cardList))
      return Alert.alert(
        'uset context - syncCardList: 카드 정보를 불러오는데 실패했습니다.',
      );
    setCards(cardList);
  }, [user.cardIdList]);
  return (
    <userContext.Provider
      value={{ cards, user, setCards, setUser, syncCardList }}
    >
      {children}
    </userContext.Provider>
  );
};

export const useUserContext = () => useContext(userContext);
