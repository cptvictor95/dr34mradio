import React, { createContext } from "react";

export const PlayerContext = createContext(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <PlayerContext.Provider value={null}>{children}</PlayerContext.Provider>
  );
};
