import React from 'react'
import type {ButtonHTMLAttributes, ReactNode} from "react";
import './styles.pcss';

export type ButtonProps = {
    onClick: () => void;
    children: ReactNode;
    className?: string;
}  & ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({onClick, children, className = '', ...props}) => {
    return (
        <button className={className ? className : "button"} onClick={onClick} {...props}>
            {children}
        </button>
    );
};

export default Button;