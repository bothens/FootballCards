import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  wrapperClassName?: string;
  endIcon?: React.ReactNode;
};

export const Label: React.FC<{ children: React.ReactNode; htmlFor: string; }> = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="block text-label uppercase font-bold text-text-muted dark:text-zinc-400 mb-2 tracking-widest">
        {children}
    </label>
);

export const Input: React.FC<InputProps> = ({ className = '', wrapperClassName = '', endIcon, ...props }) => {
  const baseStyle =
    'w-full bg-white dark:bg-zinc-800 border border-border dark:border-zinc-700 rounded-ui-md px-4 py-3 text-text dark:text-white placeholder:text-text-muted dark:placeholder:text-zinc-400 focus:outline-none focus:border-border-focus transition-colors text-sm';
  
  if (endIcon) {
    return (
      <div className={`relative ${wrapperClassName}`}>
        <input className={`${baseStyle} pr-10 ${className}`} {...props} />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {endIcon}
        </div>
      </div>
    );
  }

  return <input className={`${baseStyle} ${className}`} {...props} />;
};
