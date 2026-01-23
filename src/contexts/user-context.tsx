import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { CardDto } from '@/domain/card/card-dto';
export interface Card {
  id: string;
  title: string;
  phone: string;
  message: string;
  autoChange: boolean;
}

interface UserContextValueType {
  cards: CardDto[];
  phone: string;
}

const userContext = createContext({} as UserContextValueType);

export const UserContextProvider = ({ children }: PropsWithChildren) => {
  // temp data
  const [phone, setPhone] = useState('010-2413-0510');

  // temp data
  const [cards, setCards] = useState<CardDto[]>([
    {
      id: '123',
      title: 'my parke 1',
      phone: '010-2413-0510',
      message: 'test',
      autoChange: false,
    },
    {
      id: '456',
      title: 'my parke 2',
      phone: '010-1234-5678',
      message: 'test',
      autoChange: true,
    },
    {
      id: '789',
      title: 'my parke 3',
      phone: '010-9876-5432',
      message: 'test',
      autoChange: true,
    },
  ]);

  return (
    <userContext.Provider value={{ cards, phone }}>
      {children}
    </userContext.Provider>
  );
};

export const useUserContext = () => useContext(userContext);
