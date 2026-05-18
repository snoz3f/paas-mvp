import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRegister } from '@/api/generated/auth/auth';
import * as s from './auth.css';

const schema = z
  .object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const { mutateAsync: registerMutation, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: RegisterForm) => {
    setFormError(null);
    try {
      await registerMutation({ data: { email: data.email, password: data.password } });
      void navigate('/login');
    } catch {
      setFormError('Something went wrong. Try again.');
    }
  };

  return (
    <div className={s.page}>
      <div className={s.dotGrid} />
      <div className={s.card}>
        <div className={s.brand}>
          <span className={s.brandName}>INFRAL</span>
          <span className={s.cursor}>_</span>
        </div>

        <h1 className={s.title}>Create account</h1>
        <p className={s.subtitle}>Start deploying in minutes</p>

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
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" loading={isPending}>
            Create account
          </Button>
        </form>

        <p className={s.footer}>
          Already have an account?{' '}
          <Link to="/login" className={s.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
