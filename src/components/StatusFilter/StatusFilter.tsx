import React from 'react';
import styles from './StatusFilter.module.css';
import type {TSortValue} from "../../types/types.ts";

type SortMenuProps = {
    value: TSortValue;
    onChange: (value: TSortValue) => void;
};

const StatusFilter: React.FC<SortMenuProps> = ({ value, onChange }) => {
    return (
        <select
            className={styles.sortSelect}
            value={value}
            onChange={(e) => onChange(e.target.value as TSortValue)}
        >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
        </select>
    );
};

export default StatusFilter;