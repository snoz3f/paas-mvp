import type { ButtonHTMLAttributes } from 'react';
import * as styles from './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'ghost' | 'danger';
  width?: 'full' | 'auto';
  size?: 'md' | 'sm';
}

export function Button({ children, loading, variant = 'primary', width = 'full', size = 'md', className, ...props }: ButtonProps) {
  const variantStyle = variant === 'ghost' ? styles.ghost : variant === 'danger' ? styles.danger : styles.primary;
  const widthStyle = size === 'sm' ? styles.sm : width === 'auto' ? styles.auto : '';

  return (
    <button
      className={`${styles.base}${widthStyle ? ` ${widthStyle}` : ''} ${variantStyle}${className ? ` ${className}` : ''}`}
      disabled={loading ?? props.disabled}
      {...props}
    >
      {loading && <span className={variant === 'danger' ? styles.spinnerDanger : styles.spinner} />}
      {children}
    </button>
  );
}
