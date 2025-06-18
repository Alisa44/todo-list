import React from 'react';
import styles from './StatusFilter.module.css';
import {getFormattedText} from "../../utils/utils.ts";
import Menu from "../Menu/Menu.tsx";
import type {TMenuItem} from "../../types/types.ts";

const options = ['all', 'active', 'completed'] as const;
type Option = typeof options[number];

type Props = {
    value: Option;
    onChange: (value: Option) => void;
};

const StatusFilter: React.FC<Props> = ({ value, onChange }) => {
    const menuItems: TMenuItem[] = options.map(opt => ({
        label: getFormattedText(opt),
        onClick: () => onChange(opt)
    }))

    return (
        <Menu
            items={menuItems}
            triggerElement={<>{getFormattedText(value)} <div>⯆</div></>}
            containerClassName={styles.wrapper}
            triggerClassName={styles.trigger}
            listClassName={styles.menu}
        />
    );
};

export default StatusFilter;