import { forwardRef, type InputHTMLAttributes } from 'react';
import * as styles from './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className={styles.wrapper}>
        <label className={styles.label}>{label}</label>
        <input
          ref={ref}
          className={`${styles.input}${error ? ` ${styles.inputHasError}` : ''}`}
          {...props}
        />
        {error && <span className={styles.errorMsg}>{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
