import React, { createContext, useState } from 'react';

export const CountContext = createContext();

export function CountProvider({ children }) {
  const [isChatlist, setisChatlist] = useState(false);

  return (
    <CountContext.Provider value={[isChatlist, setisChatlist]}>
      {children}
    </CountContext.Provider>
  );
}
