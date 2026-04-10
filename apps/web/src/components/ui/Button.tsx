import type { ButtonHTMLAttributes } from 'react';
import * as styles from './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'ghost';
}

export function Button({ children, loading, variant = 'primary', className, ...props }: ButtonProps) {
  const variantStyle = variant === 'ghost' ? styles.ghost : styles.primary;

  return (
    <button
      className={`${styles.base} ${variantStyle}${className ? ` ${className}` : ''}`}
      disabled={loading ?? props.disabled}
      {...props}
    >
      {loading && <span className={styles.spinner} />}
      {children}
    </button>
  );
}
