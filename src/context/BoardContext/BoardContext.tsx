import React, { createContext, useContext } from 'react';
import { useColumns } from '../../hooks/useColumns.ts';

type BoardContextType = ReturnType<typeof useColumns>;

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const useBoardContext = () => {
    const ctx = useContext(BoardContext);
    if (!ctx) throw new Error('useBoardContext must be used inside BoardProvider');
    return ctx;
};

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const value = useColumns();
    return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};