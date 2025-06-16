import { useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {IBaseColumn} from "../types/types.ts";
import {columnListKey} from "../constants/constants.ts";

const getParsedList = (key: string): IBaseColumn[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

export const useColumns = () => {
    const [columns, setColumns] = useState<IBaseColumn[]>([]);

    useEffect(() => {
        const stored = getParsedList(columnListKey);
        setColumns(stored);
    }, []);

    useEffect(() => {
        localStorage.setItem(columnListKey, JSON.stringify(columns));
    }, [columns]);

    const addColumn = useCallback((title: string) => {
        const newColumn: IBaseColumn = {
            id: uuidv4(),
            title,
            tasks: [],
        };
        setColumns(prev => [...prev, newColumn]);
    }, []);

    const deleteColumn = useCallback((columnId: string) => {
        setColumns(prev => prev.filter(c => c.id !== columnId));
    }, []);

    const updateColumn = useCallback((updated: IBaseColumn) => {
        setColumns(prev =>
            prev.map(col => (col.id === updated.id ? updated : col))
        );
    }, []);

    return {
        columns,
        setColumns,
        addColumn,
        deleteColumn,
        updateColumn,
    };
};
