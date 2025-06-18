import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {ITaskColumn, ITask} from "../../types/types.ts";
import TaskCard from "../TaskCard/TaskCard.tsx";
import AddTaskModal from "../NewItemModal/NewItemModal.tsx";
import { v4 as uuidv4 } from 'uuid';
import styles from './DraggableColumn.module.css';
import {useBoardContext} from "../../context/BoardContext/BoardContext.tsx";
import ColumnMenu from "../ColumnMenu/ColumnMenu.tsx";
import Button from "../Button/Button.tsx";
import EditableText from "../EditableText/EditableText.tsx";
import {draggable, dropTargetForElements} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

const DraggableColumn: React.FC<ITaskColumn & {index: number}> = ({   id,
                                               title,
                                               tasks,
                                               onDeleteColumn,
                                               onSelectAll,
                                                                      index,
                                           }) => {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentTitle, setCurrentTitle] = useState<string>('');
    const [isDragging, setDragging] = useState<boolean>(false);
    const columnHeaderRef = useRef<HTMLDivElement|null>(null)
    const columnWrapperRef = useRef<HTMLDivElement|null>(null)
    const {columns, updateColumn, setColumns} = useBoardContext();
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
        if (columnWrapperRef?.current) {
            return dropTargetForElements({
                element: columnWrapperRef.current,
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
    }, [columnWrapperRef, moveTasks]);

    useEffect(() => {
        if (columnHeaderRef?.current) {
            return dropTargetForElements({
                element: columnHeaderRef.current,
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
    }, [columns, columnHeaderRef]);

    useEffect(() => {
        if (!columnHeaderRef.current) return;

        return draggable({
            element: columnHeaderRef.current,
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
        <div className={styles.taskColumn} id={id} ref={columnWrapperRef}>
            <div className={styles.columnHeader} ref={columnHeaderRef}>
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

            <div>
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