import React, {useEffect, useState} from 'react';
import TaskColumn from "../TasksColumn/TasksColumn.tsx";
import styles from './TodoList.module.css';
import {useBoardContext} from "../../context/BoardContext/BoardContext.tsx";
import BoardHeader from "../BoardHeader/BoardHeader.tsx";
import type {IBaseColumn} from "../../types/types.ts";

const TodoList: React.FC = () => {
    const {
        columns,
        deleteColumn,
        updateColumn,
    } = useBoardContext();

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentColumns, setCurrentColumns] = useState<IBaseColumn[]>([]);

    useEffect(() => {
        setCurrentColumns(columns)
    }, [columns])

    const selectAllTasksInColumn = (columnId: string) => {
        const columnToUpdate = columns.find(column => column.id === columnId)
        if (columnToUpdate) {
            const updated = {
                ...columnToUpdate,
                tasks: columnToUpdate.tasks.map(task => ({...task, selected: true}))
            }
            updateColumn(updated)
        }
    };

    const onSearchChange = (value: string) => {
        setSearchTerm(value)
        setCurrentColumns(
            columns.map(column => ({
                ...column,
                tasks: column.tasks.filter(task => task.title.includes(value))
            }))
        )
    }

    return (
        <div>
            <BoardHeader onSearchChange={onSearchChange} searchTerm={searchTerm}/>
            <div className={styles.board}>
                {currentColumns.map((column) => (
                    <TaskColumn
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        tasks={column.tasks}
                        onDeleteColumn={() => deleteColumn(column.id)}
                        onSelectAll={() => selectAllTasksInColumn(column.id)}
                    >
                    </TaskColumn>
                ))}
            </div>
        </div>
    );
};

export default TodoList;
