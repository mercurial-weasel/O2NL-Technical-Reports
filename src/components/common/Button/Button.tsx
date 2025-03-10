import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { shadows } from '@constants/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200';
  
  const variantStyles = {
    primary: `bg-gradient-to-b from-brand-primary to-[#5BA33D] text-text-primary ${shadows.button.primary} hover:${shadows.button.hover} hover:translate-y-[-1px] active:translate-y-[1px]`,
    secondary: `bg-gradient-to-b from-brand-secondary to-[#0055CC] text-text-primary ${shadows.button.primary} hover:${shadows.button.hover} hover:translate-y-[-1px] active:translate-y-[1px]`,
    tertiary: 'bg-transparent text-text-primary hover:bg-white/10'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const widthStyles = fullWidth ? 'w-full' : '';
  const disabledStyles = (disabled || loading) ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" data-testid={Icon.displayName?.toLowerCase()} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" data-testid={Icon.displayName?.toLowerCase()} />}
        </>
      )}
    </button>
  );
}