import {columnListKey} from "../constants/constants.ts";
import type {ITask, IBaseColumn} from "../types/types.ts";

export const getParsedList = (listKey: string): [] => {
    const listFromStorage = localStorage.getItem(listKey);
    return listFromStorage ? JSON.parse(listFromStorage) : [];
}

export const addTask = (newTask: ITask) => {
    const columns: IBaseColumn[] = getParsedList(columnListKey);
    const updatedColumns = columns.map(column => {
        return column.id === newTask.columnId
            ? {...column, tasks: [...column.tasks, newTask]}
            : column
    })
    localStorage.setItem(columnListKey, JSON.stringify(updatedColumns))
}

export const removeTask = (id: string, columnId: string) => {
    const columns: IBaseColumn[] = getParsedList(columnListKey);
    const updatedColumns = columns.map(column => {
        return column.id === columnId
            ? {...column, tasks: column.tasks.filter(task => task.id !== id)}
            : column
    })
    localStorage.setItem(columnListKey, JSON.stringify(updatedColumns))
}

export const changeStatus = (id: string, columnId: string) => {
    const columns: IBaseColumn[] = getParsedList(columnListKey);
    const updatedColumns = columns.map(column => {
        return column.id === columnId
            ? {
            ...column,
                tasks: column.tasks.map(task => task.id === id
                    ? {...task, completed: !task.completed}
                    : task)}
            : column
    })
    localStorage.setItem(columnListKey, JSON.stringify(updatedColumns))
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

export const addColumn = (column: IBaseColumn) => {
    const list: IBaseColumn[] = getParsedList(columnListKey)
    list.push(column);
    localStorage.setItem(columnListKey, JSON.stringify(list))
}

export const selectTask = (id: string, columnId: string) => {
    const columns: IBaseColumn[] = getParsedList(columnListKey);
    const updatedColumns = columns.map(column => {
        return column.id === columnId
            ? {
                ...column,
                tasks: column.tasks.map(task => task.id === id
                    ? {...task, selected: !task.selected}
                    : task)}
            : column
    })
    localStorage.setItem(columnListKey, JSON.stringify(updatedColumns))
}