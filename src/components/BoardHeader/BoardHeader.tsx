import React, {useState} from 'react';
import styles from './BoardHeader.module.css';
import Button from "../Button/Button.tsx";
import {useBoardContext} from "../../context/BoardContext/BoardContext.tsx";
import AddTaskModal from "../NewItemModal/NewItemModal.tsx";
import TaskFilter from "../TaskFilter/TaskFilter.tsx";
import StatusFilter from "../StatusFilter/StatusFilter.tsx";
import type {TSortValue} from "../../types/types.ts";

type HeaderProps = {
    onSearchChange: (value: string) => void;
    searchTerm: string;
    statusFilter: TSortValue;
    onStatusChange: (value: TSortValue) => void;
};

const BoardHeader: React.FC<HeaderProps> = ({ searchTerm, onSearchChange, statusFilter, onStatusChange }) => {
    const {addColumn} = useBoardContext();
    const [showModal, setShowModal] = useState<boolean>(false)

    return (
        <header className={styles.header}>
            <h1 className={styles.title}>Task Board</h1>
            <TaskFilter searchTerm={searchTerm} onSearchChange={onSearchChange}/>
            <StatusFilter value={statusFilter} onChange={onStatusChange}/>
            <Button onClick={() => setShowModal(true)}>➕ Add Column</Button>
            {showModal && (
                <AddTaskModal
                    modalTitle="Add New Column"
                    placeholder="Column Title"
                    onClose={() => setShowModal(false)}
                    onSubmit={addColumn}
                />
            )}
        </header>
    );
};

export default BoardHeader;