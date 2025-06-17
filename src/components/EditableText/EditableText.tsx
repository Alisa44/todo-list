import React, {
    useState,
    useRef,
    useEffect
} from 'react';
import type {KeyboardEvent, InputHTMLAttributes, Dispatch, SetStateAction} from 'react'

type EditableTextProps = {
    value: string;
    onChange: (value: string) => void;
    isEditing: boolean;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
    className?: string;
    placeholder?: string;
    inputClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;

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
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing) {
            setCurrentText(value);
            inputRef.current?.focus();
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

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') handleCancel();
        rest.onKeyDown?.(e);
    };

    return isEditing ? (
        <input
            ref={inputRef}
            type="text"
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`editable-input ${inputClassName}`}
            {...rest}
        />
    ) : (
        <span
            className={`editable-text ${className}`}
            onClick={() => setIsEditing(true)}
            title="Click to edit"
        >
    {value || <i className="placeholder">{placeholder}</i>}
        </span>
    );
};

export default EditableText;