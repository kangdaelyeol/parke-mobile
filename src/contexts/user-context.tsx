import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { CardDto } from '@/domain/card/card-dto';
import { UserDto } from '@/domain/user/user-dto';

interface UserContextValueType {
  cards: CardDto[];
  user: UserDto;
  setCards: React.Dispatch<React.SetStateAction<CardDto[]>>;
}

const userContext = createContext({} as UserContextValueType);

export const UserContextProvider = ({ children }: PropsWithChildren) => {
  // temp data
  const [user, setUser] = useState<UserDto>({
    id: 'uss',
    nickname: 'rkdeofuf',
    phone: '01024130510',
    cardIdList: ['123', '456', '789'],
  });

  // temp data
  const [cards, setCards] = useState<CardDto[]>([
    {
      id: '123',
      title: 'my parke 1',
      phone: '01024130510',
      message: 'test',
      autoChange: false,
      updatedAt: Date.now(),
      updatedBy: 'asd',
    },
    {
      id: '456',
      title: 'my parke 2',
      phone: '01012345678',
      message: 'test',
      autoChange: true,
      updatedAt: Date.now(),
      updatedBy: 'asd',
    },
    {
      id: '789',
      title: 'my parke 3',
      phone: '01098765432',
      message: 'test',
      autoChange: true,
      updatedAt: Date.now(),
      updatedBy: 'asd',
    },
  ]);

  return (
    <userContext.Provider value={{ cards, user, setCards }}>
      {children}
    </userContext.Provider>
  );
};

export const useUserContext = () => useContext(userContext);
