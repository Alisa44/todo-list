import React from 'react';
import styles from './TaskFilter.module.css';

type TaskFilterProps = {
    searchTerm: string;
    onSearchChange: (value: string) => void;
};

const TaskFilter: React.FC<TaskFilterProps> = ({ searchTerm, onSearchChange }) => {
    return (
        <div className={styles.filter}>
            <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className={styles.input}
            />
        </div>
    );
};

export default TaskFilter;