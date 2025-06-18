import type {ReactNode} from "react";

export interface IBaseTask {
    id: string;
    title: string;
    completed: boolean;
    selected: boolean;
    columnId: string;
}

export interface ITask extends IBaseTask {
    onSelect?: (id: string) => void;
}

export interface IBaseColumn {
    id: string;
    title: string;
    tasks: ITask[];
}

export interface ITaskColumn extends IBaseColumn{
    onDeleteColumn: () => void;
    onSelectAll: () => void;
    children?: ReactNode;
}

export type TSortValue = 'all' | 'completed' | 'active'