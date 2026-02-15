import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'transparent';
  fullWidth?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  fullWidth = false,
  ...props
}) => {
  const baseStyle =
    'py-3 px-4 font-bold uppercase tracking-widest rounded-ui-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-xs';

  const variantStyles = {
    primary:
      'bg-primary hover:bg-primary-hover text-text-inverted shadow-[0_4px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_18px_rgba(16,185,129,0.25)]',
    secondary:
      'bg-surface-200 dark:bg-zinc-800 hover:bg-surface-300 dark:hover:bg-zinc-700 text-text-muted dark:text-zinc-400 hover:text-text dark:hover:text-white border border-border dark:border-zinc-700 disabled:opacity-50',
    danger:
        'bg-danger hover:bg-danger-hover text-text-inverted',
    transparent:
        'bg-transparent hover:bg-surface-200/50 dark:hover:bg-zinc-800/50 text-text-muted dark:text-zinc-400 hover:text-text dark:hover:text-white'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
