import type {ButtonHTMLAttributes, ReactNode} from "react";
import React from 'react'

export type ButtonProps = {
    onClick: () => void;
    children: ReactNode;
    className?: string;
}  & ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({onClick, children, className = '', ...props}) => {
    return (
        <button className={className} onClick={onClick} {...props}>
            {children}
        </button>
    );
};

export default Button;