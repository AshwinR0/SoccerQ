import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { Season } from '@/types';
import { getSeasons } from '@/services/api';
import { useFetchSeasons } from '@/hooks/useFetchSeasons';

interface SeasonContextType {
  currentSeason: Season | null;
  seasons: Season[];
  setCurrentSeason: (season: Season) => void;
}

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useSeasonContext = () => {
  const context = useContext(SeasonContext);
  if (!context) {
    throw new Error('useSeasonContext must be used within a SeasonProvider');
  }
  return context;
};

interface SeasonProviderProps {
  children: ReactNode;
}

export const SeasonProvider: React.FC<SeasonProviderProps> = ({ children }) => {

  const { seasons, currentSeason, setCurrentSeason } = useFetchSeasons();

  const setCurrentSeasonWithLog = useCallback((season: Season) => {
  setCurrentSeason(season);
}, [setCurrentSeason]);

  const value = useMemo(() => ({
    currentSeason,
    seasons,
    setCurrentSeason: setCurrentSeasonWithLog,
  }), [currentSeason, seasons, setCurrentSeasonWithLog]);

  return (
    <SeasonContext.Provider value={value}>
      {children}
    </SeasonContext.Provider>
  );
};