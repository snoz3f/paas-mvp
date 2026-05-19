import { useState } from 'react';
import type React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCreateProject } from '@/api/generated/projects/projects';
import * as s from './NewProjectPage.css';

const FRAMEWORK_ICONS: Record<string, React.ReactNode> = {
  nodejs: (
    <svg width="28" height="28" viewBox="0 0 256 289" fill="none">
      <path d="M128 0L256 74v141L128 289 0 215V74L128 0z" fill="#3C873A"/>
      <path d="M128 0L256 74v141L128 289V0z" fill="#3C873A" opacity=".3"/>
      <text x="128" y="178" textAnchor="middle" fontFamily="monospace" fontWeight="bold" fontSize="96" fill="white">n</text>
    </svg>
  ),
  nestjs: (
    <svg width="28" height="28" viewBox="0 0 306 304" fill="none">
      <path d="M176.1 6.75c-3.3-1.88-7.27-1.88-10.58 0L12.67 93.8c-3.3 1.88-5.3 5.35-5.3 9.1v174.1c0 3.75 2 7.22 5.3 9.1l152.85 87.05c3.3 1.88 7.28 1.88 10.58 0l152.85-87.05c3.3-1.88 5.3-5.35 5.3-9.1V102.9c0-3.75-2-7.22-5.3-9.1L176.1 6.75z" fill="#E0234E"/>
      <path d="M195 93c-15-26-47-34-73-20l-59 34c-13 7.5-21 21-21 36v67c0 15 8 28 21 36l16 9c13 7.5 30 7.5 43 0l59-34c26-15 35-47 20-73l-6-10v-45z" fill="white" opacity=".15"/>
      <path d="M120 110l-37 21c-7 4-11 11-11 19v42c0 8 4 15 11 19l37 22c7 4 16 4 23 0l37-22c7-4 11-11 11-19v-42c0-8-4-15-11-19l-37-21c-7-4-16-4-23 0z" fill="white" opacity=".9"/>
    </svg>
  ),
  nextjs: (
    <svg width="28" height="28" viewBox="0 0 180 180" fill="none">
      <mask id="nxt-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
        <circle cx="90" cy="90" r="90" fill="white"/>
      </mask>
      <circle cx="90" cy="90" r="90" fill="black"/>
      <g mask="url(#nxt-mask)">
        <path d="M149.5 167L69 54H54v72h14V74.5l72 104.5c3.5-1.5 7-3 9.5-4l-.5 8 0.5-16z" fill="white"/>
        <rect x="112" y="54" width="14" height="72" fill="url(#nxt-grad)"/>
      </g>
      <defs>
        <linearGradient id="nxt-grad" x1="112" y1="54" x2="112" y2="126" gradientUnits="userSpaceOnUse">
          <stop stopColor="white"/>
          <stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  react: (
    <svg width="28" height="28" viewBox="0 0 256 228" fill="none">
      <ellipse cx="128" cy="114" rx="128" ry="43" stroke="#61DAFB" strokeWidth="8" fill="none"/>
      <ellipse cx="128" cy="114" rx="128" ry="43" stroke="#61DAFB" strokeWidth="8" fill="none" transform="rotate(60 128 114)"/>
      <ellipse cx="128" cy="114" rx="128" ry="43" stroke="#61DAFB" strokeWidth="8" fill="none" transform="rotate(120 128 114)"/>
      <circle cx="128" cy="114" r="14" fill="#61DAFB"/>
    </svg>
  ),
  python: (
    <svg width="28" height="28" viewBox="0 0 256 255" fill="none">
      <path d="M127.9 0C93 0 95.4 15 95.4 15l0.1 15.5h33v4.7H60.4S29 31.3 29 66.6c0 35.3 19.5 34 19.5 34h11.6v-16.4s-0.6-19.5 19.2-19.5h33.1s18.6 0.3 18.6-18V15.6S133.8 0 127.9 0zm-18.4 10c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6z" fill="url(#py-blue)"/>
      <path d="M128.1 255c34.9 0 32.5-15 32.5-15l-0.1-15.5h-33v-4.7h71.2s31.4 3.9 31.4-31.4c0-35.3-19.5-34-19.5-34h-11.6v16.4s0.6 19.5-19.2 19.5h-33.1s-18.6-0.3-18.6 18V239.4s-2.8 15.6 0 15.6zm18.4-10c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" fill="url(#py-yellow)"/>
      <defs>
        <linearGradient id="py-blue" x1="0" y1="0" x2="256" y2="255" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5A9FD4"/><stop offset="1" stopColor="#306998"/>
        </linearGradient>
        <linearGradient id="py-yellow" x1="256" y1="255" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD43B"/><stop offset="1" stopColor="#FFE873"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  docker: (
    <svg width="28" height="28" viewBox="0 0 256 190" fill="none">
      <path d="M250 76c-3-2-10-3-15-2-2-9-7-17-14-22l-3-2-2 3c-3 4-4 11-4 16 0 3 1 7 3 10-4 2-9 3-13 3H6c-3 14 1 33 11 45 11 14 28 21 47 21 45 0 78-21 94-59 11 0 29 1 37-11 1-1 5-7 5-13v-1l-2-1z" fill="#2496ED"/>
      <path d="M46 67H64v17H46zM67 67H85v17H67zM88 67h18v17H88zM109 67h18v17H109zM88 46h18v17H88zM109 46h18v17H109zM130 46h18v17H130zM130 67h18v17H130z" fill="white"/>
    </svg>
  ),
};

const FRAMEWORKS = [
  { value: 'nodejs',  label: 'Node.js' },
  { value: 'nestjs',  label: 'NestJS'  },
  { value: 'nextjs',  label: 'Next.js' },
  { value: 'react',   label: 'React'   },
  { value: 'python',  label: 'Python'  },
  { value: 'docker',  label: 'Docker'  },
] as const;

type Framework = typeof FRAMEWORKS[number]['value'];

const schema = z.object({
  name: z
    .string()
    .min(2, 'At least 2 characters')
    .max(32, 'Max 32 characters')
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens'),
  repoUrl: z.string().url('Enter a valid URL'),
  gitToken: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function NewProjectPage() {
  const navigate = useNavigate();
  const [framework, setFramework] = useState<Framework | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { mutateAsync: createProject, isPending } = useCreateProject();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setFormError(null);
    try {
      const project = await createProject({
        data: {
          name: data.name,
          repoUrl: data.repoUrl,
          framework: framework ?? undefined,
          gitToken: data.gitToken || undefined,
        },
      });
      void navigate(`/dashboard/projects/${project.id}`);
    } catch {
      setFormError('Failed to create project. Try again.');
    }
  };

  return (
    <>
      <div className={s.topbar}>
        <button className={s.backBtn} onClick={() => void navigate('/dashboard')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 12L6 8l4-4" />
          </svg>
          Projects
        </button>
        <span className={s.topbarTitle}>New project</span>
      </div>

      <div className={s.content}>
        <div className={s.card}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Project details */}
            <div className={s.section}>
              <div className={s.sectionHeader}>
                <p className={s.sectionTitle}>Project details</p>
                <p className={s.sectionDesc}>Basic information about your project</p>
              </div>
              <div className={s.sectionBody}>
                {formError && <div className={s.formError}>{formError}</div>}

                <div className={s.row}>
                  <Input
                    label="Project name"
                    placeholder="my-backend"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                  <Input
                    label="Repository URL"
                    placeholder="https://github.com/user/repo"
                    type="url"
                    error={errors.repoUrl?.message}
                    {...register('repoUrl')}
                  />
                </div>

                <div>
                  <span className={s.frameworkLabel}>Framework (optional)</span>
                  <div className={s.frameworkGrid}>
                    {FRAMEWORKS.map((fw) => (
                      <button
                        key={fw.value}
                        type="button"
                        className={
                          framework === fw.value
                            ? `${s.frameworkOption} ${s.frameworkOptionActive}`
                            : s.frameworkOption
                        }
                        onClick={() => setFramework(framework === fw.value ? null : fw.value)}
                      >
                        <span className={s.frameworkIcon}>{FRAMEWORK_ICONS[fw.value]}</span>
                        <span
                          className={
                            framework === fw.value
                              ? `${s.frameworkName} ${s.frameworkNameActive}`
                              : s.frameworkName
                          }
                        >
                          {fw.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Git Access */}
            <div className={`${s.section} ${s.sectionGit}`}>
              <div className={s.sectionHeader}>
                <div className={s.sectionTitleRow}>
                  <p className={s.sectionTitle}>Git access</p>
                  <span className={s.optionalBadge}>optional</span>
                </div>
                <p className={s.sectionDesc}>
                  For private repos and auto-deploy on push. Provide a GitHub Personal Access Token.
                </p>
              </div>
              <div className={s.sectionBody}>
                <Input
                  label="GitHub Personal Access Token"
                  type="password"
                  placeholder="github_pat_..."
                  error={errors.gitToken?.message}
                  {...register('gitToken')}
                />
                <div className={s.tokenHint}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: '1px' }}>
                    <circle cx="8" cy="8" r="6.5" />
                    <path d="M8 7v4M8 5.5v.5" />
                  </svg>
                  <span>
                    GitHub → Settings → Developer settings → Personal access tokens → Fine-grained token.
                    Permissions needed: <strong>Contents: Read</strong>, <strong>Webhooks: Read & write</strong>.
                    After saving, INFRAL auto-registers a webhook — every push to the default branch triggers a deploy.
                  </span>
                </div>
              </div>
            </div>

            <div className={s.footer}>
              <Button
                type="button"
                variant="ghost"
                width="auto"
                onClick={() => void navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isPending}>
                Create project
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
