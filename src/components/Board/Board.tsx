import React, {useEffect, useRef, useState} from 'react';
import DraggableColumn from "../DraggableColumn/DraggableColumn.tsx";
import styles from './Board.module.css';
import {useBoardContext} from "../../context/BoardContext/BoardContext.tsx";
import BoardHeader from "../BoardHeader/BoardHeader.tsx";
import type {IBaseColumn, TSortValue} from "../../types/types.ts";
import EndDropZone from "../EndDropZone/EndDropZone.tsx";

const Board: React.FC = () => {
    const {
        columns,
        deleteColumn,
        updateColumn,
    } = useBoardContext();

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<TSortValue>('all');
    const [currentColumns, setCurrentColumns] = useState<IBaseColumn[]>([]);
    const boardRef = useRef<HTMLDivElement|null>(null);

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

    const onStatusChange = (value: TSortValue): void => {
        setStatusFilter(value)
        setCurrentColumns(
            columns.map(column => {
                return {
                    ...column,
                    tasks: column.tasks.filter(task => {
                        return value === "completed"
                            ? task.completed
                            : value === "active"
                                ? !task.completed
                                : true
                    })
                }
            })
        )
    }

    return (
        <div>
            <BoardHeader
                onSearchChange={onSearchChange}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onStatusChange={onStatusChange}/>

            <div className={styles.board} ref={boardRef}>
                {currentColumns.map((column, index) => (
                    <DraggableColumn
                        index={index}
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        tasks={column.tasks}
                        onDeleteColumn={() => deleteColumn(column.id)}
                        onSelectAll={() => selectAllTasksInColumn(column.id)}
                    />
                ))}
                <EndDropZone/>
            </div>
        </div>
    );
};

export default Board;
