import React from 'react';
import styles from './StatusToggle.module.css'

type StatusToggleProps = {
    completed: boolean;
    onToggle: () => void;
};

const StatusToggle: React.FC<StatusToggleProps> = ({ completed, onToggle }) => {
    return (
        <button
            className={`${styles.statusToggle} ${completed ? styles.active : styles.inactive}`}
            onClick={onToggle}
            aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
            title={completed ? 'Mark as incomplete' : 'Mark as complete'}
        >{completed ? '✔' : ''}</button>
    );
};

export default StatusToggle;