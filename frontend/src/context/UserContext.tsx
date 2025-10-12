import React, { createContext, useState, useContext } from 'react';

export interface User {
  id: string;
  username: string;
  email?: string;
}

export interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoggedIn: boolean;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isLoggedIn: false,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Hard-coded user until login is implemented
  const [user, setUser] = useState<User | null>({
    id: 'user123',
    username: 'DemoUser',
    email: 'demo@example.com',
  });

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn: !!user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);