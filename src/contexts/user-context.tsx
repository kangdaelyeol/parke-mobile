import { createContext, PropsWithChildren, useContext, useState } from 'react';

interface Card {
  title: string;
  phone: string;
  message: string;
}

interface UserContextValueType {
  cards: Card[];
}

const userContext = createContext({} as UserContextValueType);

export default function UserContextProvider({ children }: PropsWithChildren) {
  // temp data

  const [cards] = useState([
    {
      title: 'my parke 1',
      phone: '010-2413-0510',
      message: 'test',
      autoChange: false,
    },
    {
      title: 'my parke 2',
      phone: '010-1234-5678',
      message: 'test',
      autoChange: true,
    },
    {
      title: 'my parke 3',
      phone: '010-9876-5432',
      message: 'test',
      autoChange: true,
    },
  ]);

  return (
    <userContext.Provider value={{ cards }}>{children}</userContext.Provider>
  );
}

export const useUserContext = () => useContext(userContext);
