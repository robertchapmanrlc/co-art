"use client";

import { useState, useContext, createContext, SetStateAction } from "react";

type UserContextType = {
  user: User;
  setUser: React.Dispatch<SetStateAction<User>>;
};

export const UserContext = createContext<UserContextType | null>(null);

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>({ name: "", room: "" });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);

  if (context === null)
    throw new Error(
      "useActiveSectionContext must be used within an ActiveSectionContextProvider"
    );
  
  return context;
}
