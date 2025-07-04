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

export interface ITaskColumn extends IBaseColumn {
    children?: ReactNode;
}

export type TSortValue = 'all' | 'completed' | 'active'

export type TMenuItem = {
    label: string;
    onClick: () => void;
    disabled?: boolean;
};