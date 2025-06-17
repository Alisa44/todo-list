import React, {useState} from 'react';
import type {ITaskColumn} from "../../types/types.ts";
import TaskCard from "../TaskCard/TaskCard.tsx";
import AddTaskModal from "../NewItemModal/NewItemModal.tsx";
import {selectTask} from "../../utils/utils.ts";
import { v4 as uuidv4 } from 'uuid';
import './styles.pcss';
import {useBoardContext} from "../../context/BoardContext/BoardContext.tsx";
import ColumnMenu from "../ColumnMenu/ColumnMenu.tsx";
import Button from "../Button/Button.tsx";

const TaskColumn: React.FC<ITaskColumn> = ({   id,
                                               title,
                                               tasks,
                                               onDeleteColumn,
                                               onSelectAll,
                                               children,
                                           }) => {
    const [showModal, setShowModal] = useState(false);

    const { columns, updateColumn } = useBoardContext();

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
        selectTask(taskId, id)
    }

    const onEditTitle = () => {

    }

    return (
        <div className="task-column">
            <div className="column-header">
                <div className="drag-handle" style={{display: 'none'}}>{children}</div>
                <h3 className="column-title">{title}</h3>
                <ColumnMenu
                    items={[
                        { label: 'Edit Title', onClick: onEditTitle },
                        { label: 'Delete Column', onClick: onDeleteColumn },
                        { label: 'Select All', onClick: onSelectAll}
                    ]}
                />
            </div>

            <div className="task-list">
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

            <div className="column-actions">
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