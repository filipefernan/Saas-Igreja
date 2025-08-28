import React from 'react';

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
     <input {...props} className={`w-full bg-white border border-[var(--color-border)] rounded-lg py-2 px-4 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent placeholder:text-neutral-400 transition-all ${props.className}`} />
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} className={`w-full bg-white border border-[var(--color-border)] rounded-lg py-2 px-4 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent placeholder:text-neutral-400 transition-all ${props.className}`} />
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
    <button {...props} className={`px-5 py-2.5 bg-[var(--color-text)] text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed ${props.className}`}>
        {children}
    </button>
);