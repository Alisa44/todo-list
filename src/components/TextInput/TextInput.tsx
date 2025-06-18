import React, {useEffect, useRef} from 'react';
import type {InputHTMLAttributes} from 'react';
import styles from './TextInput.module.css';

type TextInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    needsFocus?: boolean
}  & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;

const TextInput: React.FC<TextInputProps> = ({ needsFocus, value, onChange, placeholder, className, ...rest }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
       if (needsFocus && inputRef?.current) inputRef.current?.focus();
    }, []);

    return (
            <input
                ref={inputRef}
                type="text"
                placeholder={placeholder ?? ''}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`${styles.input} ${className}`}
                {...rest}
            />
    );
};

export default TextInput;