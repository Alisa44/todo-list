import 'styles.pcss'
import React, {useEffect, useRef, useState} from "react";
import type {ITask} from "../../types/types.ts";
import {changeStatus, onEditTitle, removeTask} from "../../utils/utils.ts";

const TaskCard: React.FC<ITask> = ({    id,
                                       title,
                                       completed,
                                       selected,
                                       onSelect}) => {
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
            onEditTitle(id, currentTitle.trim());
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setCurrentTitle(title);
        setIsEditing(false);
    };

    const onEdit = () => setIsEditing(prevState => !prevState);

    return (
        <div className={`task-card ${completed ? 'completed' : ''}`}>
            <div className="task-content">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={onSelect}
                    className="checkbox"
                />
                {isEditing ? (
                    <input
                        ref={inputRef}
                        className="task-input"
                        value={currentTitle}
                        onChange={(e) => setCurrentTitle(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                            if (e.key === 'Escape') handleCancel();
                        }}
                    />
                ) : (
                    <span
                        className="task-title"
                        onDoubleClick={() => setIsEditing(true)}
                    >
            {title}
          </span>
                )}
                <span className="task-title">{currentTitle}</span>
            </div>

            <div className="task-actions">
                <button onClick={() => changeStatus(id)} className="status-btn" title="Mark as complete/incomplete">
                    {completed ? '✅' : '⭕'}
                </button>
                <button onClick={onEdit} className="edit-btn" title="Edit">✏️</button>
                <button onClick={() => removeTask(id)} className="delete-btn" title="Delete">🗑️</button>
            </div>
        </div>
    );
};

export default TaskCard;