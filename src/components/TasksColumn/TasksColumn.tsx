import React, {useEffect, useState} from 'react';
import type {ITaskColumn} from "../../types/types.ts";
import TaskCard from "../TaskCard/TaskCard.tsx";
import AddTaskModal from "../NewItemModal/NewItemModal.tsx";
import { v4 as uuidv4 } from 'uuid';
import styles from './TaskColumn.module.css';
import {useBoardContext} from "../../context/BoardContext/BoardContext.tsx";
import ColumnMenu from "../ColumnMenu/ColumnMenu.tsx";
import Button from "../Button/Button.tsx";
import EditableText from "../EditableText/EditableText.tsx";

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
    const { columns, updateColumn } = useBoardContext();

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
        const currentColumn = columns.find(column => column.id === id)
        if (currentColumn) {
            const updated = {...currentColumn, tasks: [...currentColumn.tasks, newTask]}
            updateColumn(updated)
        }
    }

    const onSelect = (taskId: string) => {
        const columnToUpdate = columns.find(column => column.id === id)
        if (columnToUpdate) {
            updateColumn({...columnToUpdate,
            tasks: columnToUpdate.tasks.map(task => task.id === taskId ? {...task, selected: !task.selected} : task)})
        }
    }

    const handleSave = (newTitle: string) => {
        const columnToUpdate = columns.find(column => column.id === id);
        if (columnToUpdate) {
            updateColumn({
                ...columnToUpdate,
                title: newTitle.trim()
            })
        }
    }

    return (
        <div className={styles.taskColumn}>
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
                        { label: 'Select All', onClick: onSelectAll}
                    ]}
                />
            </div>

            <div className={styles.taskList}>
                {tasks.map((task) => (
                    <TaskCard
                        columnId={task.columnId}
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        completed={task.completed}
                        selected={task.selected}
                        onSelect={() => onSelect(task.id)}
                    />
                ))}
            </div>

            <div className={styles.columnActions}>
                <Button onClick={() => setShowModal(true)}>➕ Create</Button>
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