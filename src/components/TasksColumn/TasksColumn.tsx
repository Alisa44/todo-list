import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {ITaskColumn} from "../../types/types.ts";
import TaskCard from "../TaskCard/TaskCard.tsx";
import AddTaskModal from "../NewItemModal/NewItemModal.tsx";
import { v4 as uuidv4 } from 'uuid';
import styles from './TaskColumn.module.css';
import {useBoardContext} from "../../context/BoardContext/BoardContext.tsx";
import ColumnMenu from "../ColumnMenu/ColumnMenu.tsx";
import Button from "../Button/Button.tsx";
import EditableText from "../EditableText/EditableText.tsx";
import {dropTargetForElements} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type {ElementDragPayload, ElementDropTargetGetFeedbackArgs} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type {DragLocationHistory} from "@atlaskit/pragmatic-drag-and-drop/types";

type ElementEventBasePayload = {
    location: DragLocationHistory;
    source: ElementDragPayload;
};

const TaskColumn: React.FC<ITaskColumn> = ({   id,
                                               title,
                                               tasks,
                                               onDeleteColumn,
                                               onSelectAll,
                                               children,
                                           }) => {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentTitle, setCurrentTitle] = useState<string>('');
    const columnRef = useRef<HTMLDivElement|null>(null)
    const {columns, updateColumn} = useBoardContext();
    const currentColumn = useMemo(() => columns.find(column => column.id === id), [columns])

    const moveTask = useCallback((taskId: string, fromColumnId: string, columnId: string) => {
        const prevColumn = columns.find(column => column.id === fromColumnId)
        const targetColumn = columns.find(column => column.id === columnId)
        if (prevColumn && targetColumn) {
            const draggedTask = prevColumn.tasks.find(task => task.id === taskId);
            if (draggedTask && columnId) {
                const updatedTask = {...draggedTask, columnId}
                const filteredTasks = targetColumn.tasks.filter(task => task.id !== taskId)
                updateColumn({...prevColumn, tasks: prevColumn.tasks.filter(task => task.id !== taskId)})
                updateColumn({...targetColumn, tasks: [...filteredTasks, updatedTask]})
            }
        }
    }, [columns])

    useEffect(() => {
        if (columnRef?.current) {
            return dropTargetForElements({
                element: columnRef.current,
                canDrop: (props: ElementDropTargetGetFeedbackArgs) => props.source.data?.type === 'task',
                onDrop: (props: ElementEventBasePayload) => {
                    const { taskId, fromColumnId } = props.source.data;
                    if (typeof taskId !== 'string' || typeof fromColumnId !== 'string') {
                        return;
                    }
                    moveTask(taskId, fromColumnId, id);}
            });
        }
    }, [columnRef, moveTask]);

    useEffect(() => {
        setCurrentTitle(title)
    }, [title])

    const addTaskToThisColumn = (newTitle: string) => {
        const newTask = {
            title: newTitle,
            id: uuidv4(),
            columnId: id,
            completed: false,
            selected: false
        }
        if (currentColumn) {
            const updated = {...currentColumn, tasks: [...currentColumn.tasks, newTask]}
            updateColumn(updated)
        }
    }

    const handleSave = (newTitle: string) => {
        if (currentColumn) {
            updateColumn({
                ...currentColumn,
                title: newTitle.trim()
            })
        }
    }

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

    return (
        <div className={styles.taskColumn} ref={columnRef}>
            <div className={styles.columnHeader}>
                <div className="drag-handle" style={{display: 'none'}}>{children}</div>
                <EditableText
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    value={currentTitle}
                    onChange={handleSave}
                    inputClassName={styles.columnInput}
                    className={styles.columnTitle}/>
                <ColumnMenu
                    items={[
                        { label: 'Edit Title', onClick: () => setIsEditing(true) },
                        { label: 'Delete Column', onClick: onDeleteColumn },
                        { label: 'Select All', onClick: onSelectAll},
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
                    ]}
                />
            </div>

            <div className={styles.columnActions}>
                <Button onClick={() => setShowModal(true)}>➕ Create</Button>
            </div>

            <div className={styles.taskList}>
                {tasks.map((task) => (
                    <TaskCard task={task} currentColumn={currentColumn} key={task.id}/>
                ))}
            </div>

            {showModal && (
                <AddTaskModal
                    modalTitle="Add New Task"
                    placeholder="Task Title"
                    onClose={() => setShowModal(false)}
                    onSubmit={addTaskToThisColumn}
                />
            )}
        </div>
    );
};

export default TaskColumn;