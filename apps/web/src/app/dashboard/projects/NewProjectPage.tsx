import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ResourceSlider } from '@/components/ui/ResourceSlider';
import { RAM_STEPS, CPU_STEPS, DISK_STEPS, formatRam, formatCpu, formatDisk } from '@/lib/resources';
import { trpc } from '@/lib/trpc';
import * as s from './NewProjectPage.css';

const schema = z.object({
  name: z
    .string()
    .min(2, 'At least 2 characters')
    .max(32, 'Max 32 characters')
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens'),
});

type FormData = z.infer<typeof schema>;

export function NewProjectPage() {
  const navigate = useNavigate();
  const [selectedRepo, setSelectedRepo] = useState<{ id: number; fullName: string; url: string; private: boolean } | null>(null);
  const [repoSearch, setRepoSearch] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [ramMb, setRamMb] = useState(512);
  const [cpuMilli, setCpuMilli] = useState(500);
  const [diskGb, setDiskGb] = useState(5);

  const utils = trpc.useUtils();
  const { mutateAsync: createProject } = trpc.projects.create.useMutation();
  const { mutateAsync: createApp, isPending } = trpc.apps.create.useMutation();

  const { data: me } = trpc.auth.getMe.useQuery();
  const { data: repos = [], isLoading: reposLoading } = trpc.github.listRepos.useQuery(undefined, {
    enabled: !!me?.githubLogin,
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleConnectGithub = async () => {
    const data = await utils.github.getOAuthUrl.fetch();
    window.location.href = data.url;
  };

  const handleSelectRepo = (repo: typeof selectedRepo) => {
    setSelectedRepo(repo);
    if (repo) {
      const suggestedName = repo.fullName.split('/')[1].toLowerCase().replace(/[^a-z0-9-]/g, '-');
      setValue('name', suggestedName, { shouldValidate: false });
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedRepo) {
      setFormError('Please select a repository.');
      return;
    }
    setFormError(null);
    try {
      const project = await createProject({ name: data.name });
      await createApp({
        projectId: project.id,
        name: data.name,
        repoUrl: selectedRepo.url,
        ramMb,
        cpuMilli,
        diskGb,
      });
      void navigate(`/dashboard/projects/${project.id}`);
    } catch {
      setFormError('Failed to create project. Try again.');
    }
  };

  const filteredRepos = repos.filter((r) =>
    r.fullName.toLowerCase().includes(repoSearch.toLowerCase()),
  );

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
        {/* Left: repo picker */}
        <div className={s.leftCol}>
          <div className={s.repoHeader}>
            <p className={s.repoTitle}>Import repository</p>
            <p className={s.repoDesc}>Select a GitHub repository to deploy</p>
          </div>
          <div className={s.repoBody}>
            {!me?.githubLogin ? (
              <div className={s.connectBanner}>
                <div className={s.connectBannerText}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>Connect your GitHub account to import repositories</span>
                </div>
                <Button type="button" variant="ghost" width="auto" onClick={() => void handleConnectGithub()}>
                  Connect GitHub
                </Button>
              </div>
            ) : (
              <>
                <div className={s.repoSearch}>
                  <div className={s.githubConnected}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span>{me.githubLogin}</span>
                  </div>
                  <svg width="1" height="14" viewBox="0 0 1 14" style={{ flexShrink: 0, opacity: 0.2 }}>
                    <line x1="0" y1="0" x2="0" y2="14" stroke="currentColor" />
                  </svg>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="6.5" cy="6.5" r="4.5" />
                    <path d="M10 10l3 3" />
                  </svg>
                  <input
                    className={s.repoSearchInput}
                    placeholder="Search repositories..."
                    value={repoSearch}
                    onChange={(e) => setRepoSearch(e.target.value)}
                  />
                </div>

                <div className={s.repoList}>
                  {reposLoading ? (
                    <div className={s.repoListEmpty}>Loading repositories...</div>
                  ) : filteredRepos.length === 0 ? (
                    <div className={s.repoListEmpty}>No repositories found</div>
                  ) : (
                    filteredRepos.map((repo) => (
                      <button
                        key={repo.id}
                        type="button"
                        className={
                          selectedRepo?.id === repo.id
                            ? `${s.repoItem} ${s.repoItemActive}`
                            : s.repoItem
                        }
                        onClick={() => handleSelectRepo(repo)}
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z" />
                        </svg>
                        <span className={s.repoItemName}>{repo.fullName}</span>
                        {repo.private && <span className={s.repoPrivateBadge}>Private</span>}
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: project details */}
        <form className={s.rightCol} onSubmit={handleSubmit(onSubmit)} noValidate>
          <p className={s.rightTitle}>Project details</p>

          {selectedRepo && (
            <div className={s.selectedRepoHint}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z" />
              </svg>
              {selectedRepo.fullName}
            </div>
          )}

          <Input
            label="Project name"
            placeholder="my-backend"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className={s.resourcesSection}>
            <span className={s.resourcesLabel}>Resources</span>
            <ResourceSlider label="RAM" steps={RAM_STEPS} value={ramMb} format={formatRam} onChange={setRamMb} />
            <ResourceSlider label="CPU" steps={CPU_STEPS} value={cpuMilli} format={formatCpu} onChange={setCpuMilli} />
            <ResourceSlider label="Disk" steps={DISK_STEPS} value={diskGb} format={formatDisk} onChange={setDiskGb} />
          </div>

          {formError && <div className={s.formError}>{formError}</div>}

          <div className={s.footer}>
            <Button
              type="submit"
              loading={isPending}
              disabled={!me?.githubLogin || !selectedRepo}
            >
              Create project
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => void navigate('/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
