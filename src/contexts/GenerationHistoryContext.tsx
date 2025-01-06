import React, { createContext, useContext, useState } from 'react';
import { GenerationHistory } from '../types';

interface GenerationHistoryContextType {
  history: GenerationHistory[];
  addGeneration: (generation: Omit<GenerationHistory, 'id'>) => void;
}

const GenerationHistoryContext = createContext<GenerationHistoryContextType>({
  history: [],
  addGeneration: () => {},
});

export const GenerationHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<GenerationHistory[]>([]);

  const addGeneration = (generation: Omit<GenerationHistory, 'id'>) => {
    const newEntry: GenerationHistory = {
      id: crypto.randomUUID(),
      ...generation,
    };
    setHistory(prev => [newEntry, ...prev]);
  };

  return (
    <GenerationHistoryContext.Provider value={{ history, addGeneration }}>
      {children}
    </GenerationHistoryContext.Provider>
  );
};

export const useGenerationHistory = () => useContext(GenerationHistoryContext);
