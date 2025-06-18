import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {ITaskColumn, ITask} from "../../types/types.ts";
import TaskCard from "../TaskCard/TaskCard.tsx";
import AddTaskModal from "../NewItemModal/NewItemModal.tsx";
import { v4 as uuidv4 } from 'uuid';
import styles from './DraggableColumn.module.css';
import {useBoardContext} from "../../context/BoardContext/BoardContext.tsx";
import ColumnMenu from "../ColumnMenu/ColumnMenu.tsx";
import Button from "../../components/Button/Button.tsx";
import EditableText from "../../components/EditableText/EditableText.tsx";
import {draggable, dropTargetForElements} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

const DraggableColumn: React.FC<ITaskColumn & {index: number}> = ({   id,
                                               title,
                                               tasks,
                                                                      index,
                                           }) => {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentTitle, setCurrentTitle] = useState<string>('');
    const [isDragging, setDragging] = useState<boolean>(false);
    const {columns, updateColumn, setColumns} = useBoardContext();

    const columnRef = useRef<HTMLDivElement|null>(null)
    const tasksWrapperRef = useRef<HTMLDivElement|null>(null)

    const currentColumn = useMemo(() => columns.find(column => column.id === id), [columns])

    const moveTasks = useCallback((tasks: ITask[], fromColumnId: string, columnId: string) => {
        const prevColumn = columns.find(column => column.id === fromColumnId)
        const targetColumn = columns.find(column => column.id === columnId)
        const taskIds = tasks.map(task => task.id);
        if (prevColumn && targetColumn) {
            const draggedTasks = prevColumn.tasks.filter(task => taskIds.includes(task.id));
            if (draggedTasks.length && columnId) {
                const updatedTasks = draggedTasks.map(task => ({...task, columnId, selected: false}))
                const filteredTasks = prevColumn.tasks.filter(task => !taskIds.includes(task.id))
                if (targetColumn.id !== prevColumn.id) {
                    updateColumn({...targetColumn, tasks: [...targetColumn.tasks, ...updatedTasks]})
                    updateColumn({...prevColumn, tasks: filteredTasks})
                } else {
                    updateColumn({...prevColumn, tasks: [...filteredTasks, ...draggedTasks]})
                }
            }
        }
    }, [columns])

    useEffect(() => {
        if (tasksWrapperRef?.current) {
            return dropTargetForElements({
                element: tasksWrapperRef.current,
                onDragStart: () => setDragging(true),
                onDragLeave: () => setDragging(false),
                canDrop: ({source}) => source.data?.type === 'task-group',
                onDrop: ({ source }) => {
                    const { fromColumnId } = source.data;
                    const tasks: ITask[] = source.data.taskIds as ITask[];
                    if (typeof fromColumnId !== 'string') {
                        return;
                    }
                    moveTasks(tasks, fromColumnId, id);}
            });
        }
    }, [tasksWrapperRef, moveTasks]);

    useEffect(() => {
        if (columnRef?.current) {
            return dropTargetForElements({
                element: columnRef.current,
                canDrop: ({ source }) => source.data?.type === 'column',
                onDrop: ({ source, location }) => {
                    const { columnId } = source.data;
                    const draggedIndex = columns.findIndex((c) => c.id === columnId);
                    const overElement = location.current.dropTargets[0]?.element?.id;
                    const targetIndex = columns.findIndex(column => column.id ===overElement);

                    if (draggedIndex === targetIndex) return;
                    let updated = [...columns];
                    const [moved] = updated.splice(draggedIndex, 1);
                    if (targetIndex > -1) {
                        updated.splice(targetIndex, 0, moved);
                    } else {
                        updated = [...updated, moved]
                    }
                    setColumns(updated);
                },
            });
        }
    }, [columns, columnRef]);

    useEffect(() => {
        if (!columnRef.current) return;

        return draggable({
            element: columnRef.current,
            getInitialData: () => ({
                type: 'column',
                columnId: id,
                index,
            }),
        });
    }, [id, index]);

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

    return (
        <div className={styles.taskColumn} id={id} ref={columnRef}>
            <div className={styles.columnHeader} >
                <EditableText
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    value={currentTitle}
                    onChange={handleSave}
                    inputClassName={styles.columnInput}
                    className={styles.columnTitle}/>
                <ColumnMenu currentColumn={currentColumn} setIsEditing={setIsEditing}/>
            </div>

            <div className={styles.tasksWrapper} ref={tasksWrapperRef}>
                <div className={styles.columnActions}>
                    <Button onClick={() => setShowModal(true)}>➕ Create</Button>
                </div>

                <div className={styles.taskList}>
                    {tasks.map((task, index) => (
                        <TaskCard task={task} currentColumn={currentColumn} key={task.id} isDragging={isDragging} index={index}/>
                    ))}
                </div>
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

export default DraggableColumn;