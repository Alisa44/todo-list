import React, {useRef, useEffect} from 'react';
import type {InputHTMLAttributes} from 'react';
import styles from './TextArea.module.css';

type TextAreaProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    needsFocus?: boolean
}  & Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'>;

const TextArea: React.FC<TextAreaProps> = ({ value, onChange, ...rest }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef?.current) {
            textareaRef.current?.focus();
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value, textareaRef]);

    return (
        <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={1}
            {...rest}
        />
    );
};

export default TextArea;
