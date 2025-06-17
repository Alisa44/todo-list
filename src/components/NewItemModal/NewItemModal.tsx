import React, { useState, useEffect, useRef } from 'react';
import './styles.pcss';
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

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>{modalTitle}</h3>
                <input
                    ref={inputRef}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={placeholder}
                />
                <div className="modal-actions">
                    <Button className="cancel" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Add</Button>
                </div>
            </div>
        </div>
    );
};

export default NewItemModal;