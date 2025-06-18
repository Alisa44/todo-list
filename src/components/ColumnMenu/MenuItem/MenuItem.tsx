import React from "react";
import styles from "./MenuItem.module.css";
import type {TMenuItem} from "../../../types/types.ts";

type MenuItemProps = {
    onItemClick: (item: TMenuItem) => void;
    item: TMenuItem;
    index: number;
}

const MenuItem: React.FC<MenuItemProps> = ({item, index, onItemClick}) => {
    return (
        <div
            className={`${styles.menuItem} ${item.disabled ? styles.disabled : ''}`}
            key={index}
            onClick={() => onItemClick(item)}>
            {item.label}
        </div>
    );
};

export default MenuItem;