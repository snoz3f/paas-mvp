import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { axiosInstance } from '@/lib/axios';
import * as s from './auth.css';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: LoginForm) => {
    setFormError(null);
    try {
      const res = await axiosInstance.post<{ accessToken: string }>('/auth/login', data);
      localStorage.setItem('token', res.data.accessToken);
      void navigate('/dashboard');
    } catch {
      setFormError('Invalid email or password');
    }
  };

  return (
    <div className={s.page}>
      <div className={s.dotGrid} />
      <div className={s.card}>
        <div className={s.brand}>
          <span className={s.brandName}>FORGE</span>
          <span className={s.cursor}>_</span>
        </div>

        <h1 className={s.title}>Sign in</h1>
        <p className={s.subtitle}>Deploy your projects to production</p>

        <form onSubmit={handleSubmit(onSubmit)} className={s.form} noValidate>
          {formError && <div className={s.formError}>{formError}</div>}

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" loading={isSubmitting}>
            Continue
          </Button>
        </form>

        <p className={s.footer}>
          No account?{' '}
          <Link to="/register" className={s.link}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
