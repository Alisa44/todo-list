import React, {useState} from 'react';
import TaskColumn from "../TasksColumn/TasksColumn.tsx";
import './styles.pcss';
import Button from "../Button/Button.tsx";
import AddTaskModal from "../NewItemModal/NewItemModal.tsx";
import {useBoardContext} from "../../context/BoardContext/BoardContext.tsx";

const TodoList: React.FC = () => {
    const {
        columns,
        deleteColumn,
        updateColumn,
        addColumn
    } = useBoardContext();

    const [showModal, setShowModal] = useState<boolean>(false)

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

    return (
        <div className="board">
            {columns.map((column) => (
                <TaskColumn
                    key={column.id}
                    id={column.id}
                    title={column.title}
                    tasks={column.tasks}
                    onDeleteColumn={() => deleteColumn(column.id)}
                    onSelectAll={() => selectAllTasksInColumn(column.id)}
                >
                </TaskColumn>
            ))}
            <Button className="add-column-btn" onClick={() => setShowModal(true)}>➕ Add Column</Button>
            {showModal && (
                <AddTaskModal
                    modalTitle="Add New Column"
                    placeholder="Column Title"
                    onClose={() => setShowModal(false)}
                    onSubmit={addColumn}
                />
            )}
        </div>
    );
};

export default TodoList;
