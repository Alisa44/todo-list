import './styles.pcss';
import React, {useEffect, useRef, useState} from "react";
import type {ITask} from "../../types/types.ts";
import {onEditTitle} from "../../utils/utils.ts";
import Button from "../Button/Button.tsx";
import StatusToggle from "../StatusToggle/StatusToggle.tsx";
import {useBoardContext} from "../../context/BoardContext/BoardContext.tsx";
import EditableText from "../EditableText/EditableText.tsx";
import {EditIcon} from "../EditIcon/EditIcon.tsx";
import {DeleteIcon} from "../DeleteIcon/DeleteIcon.tsx";

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
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setCurrentTitle(title)
    }, [title])

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleSave = () => {
        if (currentTitle.trim() && currentTitle !== title) {
            onEditTitle(id, currentTitle.trim(), columnId);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setCurrentTitle(title);
        setIsEditing(false);
    };

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

    const onSelectTask = () => onSelect && onSelect(id)

    return (
        <div className={`task-card ${completed ? 'completed' : ''}  ${selected ? 'selected' : ''}`}>
            <div className="task-content">
                <input
                    title={selected ? "Deselect" : "Select"}
                    type="checkbox"
                    checked={selected}
                    onChange={onSelectTask}
                    className="checkbox"
                />
                <EditableText
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    value={currentTitle}
                    onChange={setCurrentTitle}
                    inputClassName="task-input"
                    className="task-title"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave();
                        if (e.key === 'Escape') handleCancel();
                    }}/>
            </div>

            <div className="task-actions">
                <StatusToggle completed={completed} onToggle={onStatusChange}/>
                <div>
                    <Button onClick={onEdit} className="edit-btn" title="Edit"><EditIcon size={20}/></Button>
                    <Button onClick={onDeleteTask} className="delete-btn" title="Delete">
                        <DeleteIcon color="#10b981" size={20}/>️
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;