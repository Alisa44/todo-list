import React, {useEffect, useState} from "react";
import type {ITask} from "../../types/types.ts";
import Button from "../Button/Button.tsx";
import StatusToggle from "../StatusToggle/StatusToggle.tsx";
import {useBoardContext} from "../../context/BoardContext/BoardContext.tsx";
import EditableText from "../EditableText/EditableText.tsx";
import {EditIcon} from "../EditIcon/EditIcon.tsx";
import {DeleteIcon} from "../DeleteIcon/DeleteIcon.tsx";
import styles from './TaskCard.module.css'

const TaskCard: React.FC<ITask> = ({   id,
                                       title,
                                       completed,
                                       selected,
                                       onSelect,
                                       columnId
                                   }) => {
    const {updateColumn, columns} = useBoardContext();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentTitle, setCurrentTitle] = useState<string>('');

    useEffect(() => {
        setCurrentTitle(title)
    }, [title])

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

    const onSelectTask = () => onSelect && onSelect(id)

    return (
        <div className={`${styles.taskCard} ${completed ? styles.completed : ''}  ${selected ? styles.selected : ''}`}>
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