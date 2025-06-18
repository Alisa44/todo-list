import React, { useState, useRef, useEffect } from 'react';
import styles from './ColumnMenu.module.css';
import type {TMenuItem} from "../../types/types.ts";
import MenuItem from "./MenuItem/MenuItem.tsx";

type MenuButtonProps = {
    items: TMenuItem[];
};

const MenuButton: React.FC<MenuButtonProps> = ({ items }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref]);

    const onItemClick = (item: TMenuItem) => {
        !item.disabled && item.onClick();
        setOpen(false);
    }

    const onMenuOpen = () => setOpen((prev) => !prev)

    return (
        <div className={styles.menuContainer} ref={ref}>
            <button className={styles.menuTrigger} onClick={onMenuOpen}>
                ⋮
            </button>

            {open && (
                <ul className={styles.menuList}>
                    {items.map((item, i) => (
                        <MenuItem item={item} index={i} onItemClick={onItemClick}/>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MenuButton;
