import React, {useEffect, useMemo, useRef, useState} from "react";
import type {IBaseColumn, ITask} from "../../types/types.ts";
import Button from "../Button/Button.tsx";
import StatusToggle from "../StatusToggle/StatusToggle.tsx";
import {useBoardContext} from "../../context/BoardContext/BoardContext.tsx";
import EditableText from "../EditableText/EditableText.tsx";
import {EditIcon} from "../EditIcon/EditIcon.tsx";
import {DeleteIcon} from "../DeleteIcon/DeleteIcon.tsx";
import styles from './TaskCard.module.css'
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

const TaskCard: React.FC<{ task: ITask, currentColumn?: IBaseColumn, isDragging: boolean }> = ({task, currentColumn, isDragging}) => {
    const {updateColumn, columns} = useBoardContext();
    const {   id,
        title,
        completed,
        selected,
        columnId
    } = task

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentTitle, setCurrentTitle] = useState<string>('');
    const ref = useRef<HTMLDivElement|null>(null);
    const selectedTaskIds = useMemo(() => {
        return currentColumn?.tasks.filter(task => task.selected)?.map(task => task.id)
    }, [currentColumn])

    useEffect(() => {
        setCurrentTitle(title)
        if (ref.current) {
            draggable({
                element: ref.current,
                canDrag: () => selected,
                getInitialData: () => {
                    const isSelected = selectedTaskIds?.includes(task.id);
                    const tasksToMove = isSelected
                        ? selectedTaskIds
                        : [task.id];

                    return {
                        type: 'task-group',
                        taskIds: tasksToMove,
                        fromColumnId: columnId,
                    };
                },
            });
        }
    }, [title, ref, selected, selectedTaskIds])

    const onEdit = () => setIsEditing(prevState => !prevState);

    const onStatusChange = () => {
        const columnToUpdate = columns.find(column => column.id === columnId);
        if (columnToUpdate) {
            updateColumn({
                ...columnToUpdate,
                tasks: columnToUpdate.tasks.map(task => task.id === id
                    ? {...task, completed: !task.completed}
                    : task)})
        }
    }

    const onDeleteTask = () => {
        const columnToUpdate = columns.find(column => column.id === columnId);
        if (columnToUpdate) {
            updateColumn({
                ...columnToUpdate,
                tasks: columnToUpdate.tasks.filter(task => task.id !== id)
            })
        }
    }

    const onEditTaskTitle = (newTitle: string) => {
        const columnToUpdate = columns.find(column => column.id === columnId);
        if (columnToUpdate) {
            updateColumn({
                ...columnToUpdate,
                tasks: columnToUpdate.tasks.map(task => task.id === id
                    ? {...task, title: newTitle.trim()}
                    : task)
            })
        }
    }

    const handleSave = (newTitle: string) => {
        if (newTitle.trim() && newTitle !== title) {
            onEditTaskTitle(newTitle);
        }
        setIsEditing(false);
    };

    const onSelectTask = () => {
        if (currentColumn) {
            updateColumn({...currentColumn,
                tasks: currentColumn.tasks.map(task => task.id === id ? ({...task, selected: !task.selected}) : task)})
        }
    }

    return (
        <div
            ref={ref}
            className={`${styles.taskCard} ${completed ? styles.completed : ''}  ${selected ? styles.selected : ''} ${isDragging ? styles.dragging : ''}`}>
            <div className={styles.taskContent}>
                <input
                    title={selected ? "Deselect" : "Select"}
                    type="checkbox"
                    checked={selected}
                    onChange={onSelectTask}
                    className={styles.checkbox}
                />
                <EditableText
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    value={currentTitle}
                    onChange={handleSave}
                    inputClassName={styles.taskInput}
                    className={styles.taskTitle}/>
            </div>

            <div className={styles.taskActions}>
                <StatusToggle completed={completed} onToggle={onStatusChange}/>
                <Button onClick={onEdit} className={styles.editBtn} title="Edit"><EditIcon size={24}/></Button>
                <Button onClick={onDeleteTask} className={styles.deleteBtn} title="Delete">
                    <DeleteIcon color="#10b981" size={24}/>️
                </Button>
            </div>
        </div>
    );
};

export default TaskCard;