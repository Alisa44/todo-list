import React, {useState, useEffect, useRef} from 'react';
import type {KeyboardEvent} from 'react';
import styles from'./NewItemModal.module.css';
import Button from "../Button/Button.tsx";

type NewTaskModalProps = {
    onClose: () => void;
    onSubmit: (title: string) => void;
    modalTitle: string;
    placeholder: string;
};

const NewItemModal: React.FC<NewTaskModalProps> = ({ onClose, onSubmit, modalTitle, placeholder }) => {
    const [title, setTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = () => {
        if (title.trim()) {
            onSubmit(title.trim());
            setTitle('');
            onClose();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSubmit();
        if (e.key === 'Escape') onClose();
    };

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3>{modalTitle}</h3>
                <input
                    ref={inputRef}
                    type="text"
                    value={title}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={placeholder}
                />
                <div className={styles.modalActions}>
                    <Button className={styles.cancel} onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Add</Button>
                </div>
            </div>
        </div>
    );
};

export default NewItemModal;