import React, {useState} from 'react';
import styles from './BoardHeader.module.css';
import Button from "../../components/Button/Button.tsx";
import {useBoardContext} from "../../context/BoardContext/BoardContext.tsx";
import AddTaskModal from "../NewItemModal/NewItemModal.tsx";
import TextInput from "../../components/TextInput/TextInput.tsx";
import StatusFilter from "../../components/StatusFilter/StatusFilter.tsx";
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
            <div className={styles.filter}>
                <TextInput
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={onSearchChange}
                    className={styles.searchInput}/>
            </div>
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