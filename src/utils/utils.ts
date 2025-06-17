import {columnListKey} from "../constants/constants.ts";
import type {IBaseColumn} from "../types/types.ts";

export const getParsedList = (listKey: string): [] => {
    const listFromStorage = localStorage.getItem(listKey);
    return listFromStorage ? JSON.parse(listFromStorage) : [];
}

export const onEditTitle = (id: string, newTitle: string, columnId: string) => {
    const columns: IBaseColumn[] = getParsedList(columnListKey);
    const updatedColumns = columns.map(column => {
        return column.id === columnId
            ? {
                ...column,
                tasks: column.tasks.map(task => task.id === id
                    ? {...task, title: newTitle}
                    : task)}
            : column
    })
    localStorage.setItem(columnListKey, JSON.stringify(updatedColumns))
}