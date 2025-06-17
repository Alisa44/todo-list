import React, { useState, useRef, useEffect } from 'react';
import './styles.pcss';

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
        <div className="menu-container" ref={ref}>
            <button
                className="menu-trigger"
                onClick={() => setOpen((prev) => !prev)}
            >
                ⋮
            </button>

            {open && (
                <ul className="menu-list">
                    {items.map((item, i) => (
                        <div className="menu-item" key={i} onClick={() => { item.onClick(); setOpen(false); }}>
                            {item.label}
                        </div>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MenuButton;
