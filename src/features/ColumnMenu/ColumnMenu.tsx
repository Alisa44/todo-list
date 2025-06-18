import React from 'react';
import type {Dispatch, SetStateAction} from 'react';
import type {IBaseColumn} from "../../types/types.ts";
import Menu from "../../components/Menu/Menu.tsx";
import {useBoardContext} from "../../context/BoardContext/BoardContext.tsx";

type MenuButtonProps = {
    setIsEditing: Dispatch<SetStateAction<boolean>>;
    currentColumn?: IBaseColumn;
};

const ColumnMenu: React.FC<MenuButtonProps> = ({ setIsEditing, currentColumn }) => {
    const {updateColumn, deleteColumn} = useBoardContext();

    const onDeleteSelectedTasks = () => {
        if (currentColumn) {
            updateColumn({...currentColumn,
                tasks: currentColumn.tasks.filter(task => !task.selected)})
        }
    }

    const onMarkSelectedAsComplete = () => {
        if (currentColumn) {
            updateColumn({...currentColumn,
                tasks: currentColumn.tasks.map(task => task.selected ? ({...task, completed: true}) : task)})
        }
    }

    const onMarkSelectedAsIncomplete = () => {
        if (currentColumn) {
            updateColumn({...currentColumn,
                tasks: currentColumn.tasks.map(task => task.selected ? ({...task, completed: false}) : task)})
        }
    }

    const onDeleteColumn = () => {
        currentColumn && deleteColumn(currentColumn.id)
    }

    const selectAllTasksInColumn = () => {
        if (currentColumn) {
            const updated = {
                ...currentColumn,
                tasks: currentColumn.tasks.map(task => ({...task, selected: true}))
            }
            updateColumn(updated)
        }
    };

    const menuItems = [
        { label: 'Edit Title', onClick: () => setIsEditing(true) },
        { label: 'Delete Column', onClick: onDeleteColumn  },
        { label: 'Select All', onClick: selectAllTasksInColumn},
        {
            label: 'Delete Selected',
            onClick: onDeleteSelectedTasks,
            disabled: !currentColumn?.tasks.find(task => task.selected)
        },
        {
            label: 'Mark Selected As Complete',
            onClick: onMarkSelectedAsComplete,
            disabled: !currentColumn?.tasks.find(task => task.selected)
        },
        {
            label: 'Mark Selected As Incomplete',
            onClick: onMarkSelectedAsIncomplete,
            disabled: !currentColumn?.tasks.find(task => task.selected)
        },
    ]
    return (
        <Menu items={menuItems} triggerElement={<span>⋮</span>}/>
    );
};

export default ColumnMenu;
