import {lsKey} from "../constants/constants.ts";
import type {ITask} from "../types/types.ts";

export const getParsedTasks = (): ITask[] => {
    const listFromStorage = localStorage.getItem(lsKey);
    return listFromStorage ? JSON.parse(listFromStorage) : [];
}

export const addTask = (task: ITask) => {
    const list = getParsedTasks()
    list.push(task);
    localStorage.setItem(lsKey, JSON.stringify(list))
}

export const removeTask = (id: string) => {
    let list: ITask[] = getParsedTasks();
    const taskToRemove = list.find(task => task.id === id);
    if (taskToRemove) {
        list = list.filter(task => task.id === taskToRemove.id)
    }
    localStorage.setItem(lsKey, JSON.stringify(list))
}

export const changeStatus = (id: string) => {
    let list: ITask[] = getParsedTasks();
    const taskToChange = list.find(task => task.id === id);
    const taskToChangeIndex = list.findIndex(task => task.id === id);
    if (taskToChange && taskToChangeIndex > -1) {
        const updatedTask = {...taskToChange, completed: !taskToChange.completed}
        list = list.splice(taskToChangeIndex, 1, updatedTask)
    }
    localStorage.setItem(lsKey, JSON.stringify(list))
}

export const onEditTitle = (id: string, newTitle: string) => {
    let list: ITask[] = getParsedTasks();
    const taskToChange = list.find(task => task.id === id);
    const taskToChangeIndex = list.findIndex(task => task.id === id);
    if (taskToChange && taskToChangeIndex > -1) {
        const updatedTask = {...taskToChange, title: newTitle}
        list = list.splice(taskToChangeIndex, 1, updatedTask)
    }
    localStorage.setItem(lsKey, JSON.stringify(list))
}