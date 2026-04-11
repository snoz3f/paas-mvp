import type { ButtonHTMLAttributes } from 'react';
import * as styles from './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'ghost';
  width?: 'full' | 'auto';
}

export function Button({ children, loading, variant = 'primary', width = 'full', className, ...props }: ButtonProps) {
  const variantStyle = variant === 'ghost' ? styles.ghost : styles.primary;
  const widthStyle = width === 'auto' ? styles.auto : '';

  return (
    <button
      className={`${styles.base} ${variantStyle}${widthStyle ? ` ${widthStyle}` : ''}${className ? ` ${className}` : ''}`}
      disabled={loading ?? props.disabled}
      {...props}
    >
      {loading && <span className={styles.spinner} />}
      {children}
    </button>
  );
}
