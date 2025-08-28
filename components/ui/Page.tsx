import React from 'react';

export const PageHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
    <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text)]">{title}</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">{subtitle}</p>
    </div>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`bg-white p-6 rounded-xl border border-[var(--color-border)] shadow-sm ${className}`}>
        {children}
    </div>
);