import React, { useState, useRef, useEffect } from 'react';
import styles from './Menu.module.css';
import type {TMenuItem} from "../../types/types.ts";
import MenuItem from "./MenuItem/MenuItem.tsx";

type MenuProps = {
    items: TMenuItem[];
    containerClassName?: string;
    triggerClassName?: string;
    listClassName?: string;
    triggerElement: React.ReactElement;
};

const Menu: React.FC<MenuProps> = ({ items, triggerClassName, triggerElement, listClassName, containerClassName }) => {
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
        <div className={containerClassName ?? styles.menuContainer} ref={ref}>
            <button className={triggerClassName ?? styles.menuTrigger} onClick={onMenuOpen}>
                {triggerElement}
            </button>

            {open && (
                <ul className={listClassName ?? styles.menuList}>
                    {items.map((item, i) => (
                        <MenuItem item={item} index={i} onItemClick={onItemClick} key={item.label}/>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Menu;
