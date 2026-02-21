import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { CardDto } from '@/domain/card/card-dto';
import { UserDto } from '@/domain/user/user-dto';

interface UserContextValueType {
  cards: CardDto[];
  user: UserDto;
  setUser: React.Dispatch<React.SetStateAction<UserDto>>;
  setCards: React.Dispatch<React.SetStateAction<CardDto[]>>;
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
  return (
    <userContext.Provider value={{ cards, user, setCards, setUser }}>
      {children}
    </userContext.Provider>
  );
};

export const useUserContext = () => useContext(userContext);
