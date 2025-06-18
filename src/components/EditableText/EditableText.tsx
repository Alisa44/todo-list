import React, {
    useState,
    useEffect
} from 'react';
import type {KeyboardEvent, InputHTMLAttributes, Dispatch, SetStateAction} from 'react'
import styles from './EditableText.module.css';
import TextArea from "../TextArea/TextArea.tsx";

type EditableTextProps = {
    value: string;
    onChange: (value: string) => void;
    isEditing: boolean;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
    className?: string;
    placeholder?: string;
    inputClassName?: string;
} & Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'>;

const EditableText: React.FC<EditableTextProps> = ({
                                                       value,
                                                       onChange,
                                                       className = '',
                                                       inputClassName = '',
                                                       placeholder = 'Enter text',
                                                       setIsEditing,
                                                       isEditing,
                                                       ...rest
                                                   }) => {
    const [currentText, setCurrentText] = useState(value);

    useEffect(() => {
        if (isEditing) {
            setCurrentText(value);
        }
    }, [isEditing]);

    const handleSave = () => {
        if (currentText.trim() && currentText !== value) {
            onChange(currentText.trim());
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setCurrentText(value);
        setIsEditing(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') handleCancel();
    };

    return isEditing ? (
        <TextArea
            type="text"
            value={currentText}
            onChange={(value) => setCurrentText(value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`${styles.editableInput} ${inputClassName}`}
            {...rest}
        />
    ) : (
        <span
            className={`${styles.editableText} ${className}`}
            onClick={() => setIsEditing(true)}
            title="Click to edit"
        >
    {value || <i className={styles.placeholder}>{placeholder}</i>}
        </span>
    );
};

export default EditableText;