import React, { useState, useRef, useEffect } from 'react';
import styles from './ColumnMenu.module.css';

type MenuItem = {
    label: string;
    onClick: () => void;
};

type MenuButtonProps = {
    items: MenuItem[];
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
    }, []);

    return (
        <div className={styles.menuContainer} ref={ref}>
            <button
                className={styles.menuTrigger}
                onClick={() => setOpen((prev) => !prev)}
            >
                ⋮
            </button>

            {open && (
                <ul className={styles.menuList}>
                    {items.map((item, i) => (
                        <div className={styles.menuItem} key={i} onClick={() => { item.onClick(); setOpen(false); }}>
                            {item.label}
                        </div>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MenuButton;
