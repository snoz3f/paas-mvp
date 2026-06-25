import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/Button';
import { siPostgresql, siRedis, siMysql, siMongodb } from 'simple-icons';
import * as s from './NewServicePanel.css';

interface ServiceDef {
  type: string;
  name: string;
  desc: string;
  icon: { path: string; hex: string };
  defaultEnvKey: string;
  available: boolean;
}

const CATALOG: { category: string; items: ServiceDef[] }[] = [
  {
    category: 'Database',
    items: [
      { type: 'POSTGRES', name: 'PostgreSQL', desc: 'Open source relational database', icon: siPostgresql, defaultEnvKey: 'DATABASE_URL', available: true },
      { type: 'MYSQL',    name: 'MySQL',      desc: 'Popular relational database',     icon: siMysql,      defaultEnvKey: 'DATABASE_URL', available: false },
      { type: 'MONGODB',  name: 'MongoDB',    desc: 'NoSQL document database',          icon: siMongodb,    defaultEnvKey: 'MONGODB_URL',  available: false },
    ],
  },
  {
    category: 'Cache',
    items: [
      { type: 'REDIS', name: 'Redis', desc: 'In-memory data structure store', icon: siRedis, defaultEnvKey: 'REDIS_URL', available: true },
    ],
  },
];

interface Props {
  projectId: string;
  onClose: () => void;
  onCreated: () => void;
}

export function NewServicePanel({ projectId, onClose, onCreated }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<ServiceDef | null>(null);
  const [envKey, setEnvKey] = useState('');
  const { mutateAsync: createService, isPending } = trpc.services.create.useMutation();

  const query = search.toLowerCase();
  const filtered = CATALOG
    .filter((cat) => !activeCategory || cat.category === activeCategory)
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) => !query || item.name.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query),
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  const handleSelect = (item: ServiceDef) => {
    if (!item.available) return;
    setSelected(item);
    setEnvKey(item.defaultEnvKey);
  };

  const handleProvision = async () => {
    if (!selected) return;
    await createService({ projectId, type: selected.type as 'POSTGRES' | 'REDIS', version: 'latest', envKey });
    onCreated();
    onClose();
  };

  return (
    <div className={s.panel}>
      <div className={s.header}>
        <button className={s.backBtn} onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 12L6 8l4-4" />
          </svg>
        </button>
        <span className={s.title}>Add service</span>
      </div>

      <div className={s.searchRow}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0, opacity: 0.4 }}>
          <circle cx="6.5" cy="6.5" r="4.5" /><path d="M10 10l3 3" />
        </svg>
        <input
          className={s.searchInput}
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
      </div>

      <div className={s.catalog}>
        {filtered.map((cat) => (
          <div key={cat.category} className={s.category}>
            <span className={s.categoryLabel}>{cat.category}</span>
            <div className={s.grid}>
              {cat.items.map((item) => (
                <button
                  key={item.type}
                  className={[
                    s.card,
                    selected?.type === item.type ? s.cardSelected : '',
                    !item.available ? s.cardDisabled : '',
                  ].join(' ')}
                  onClick={() => handleSelect(item)}
                  disabled={!item.available}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={`#${item.icon.hex}`} className={s.cardIcon}>
                    <path d={item.icon.path} />
                  </svg>
                  <span className={s.cardName}>{item.name}</span>
                  <span className={s.cardDesc}>{item.desc}</span>
                  {!item.available && <span className={s.soonBadge}>soon</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className={s.modalOverlay} onClick={() => setSelected(null)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <div className={s.configHeader}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill={`#${selected.icon.hex}`}>
                  <path d={selected.icon.path} />
                </svg>
                <span className={s.configName}>{selected.name}</span>
              </div>
              <button className={s.modalClose} onClick={() => setSelected(null)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 2l10 10M12 2L2 12" />
                </svg>
              </button>
            </div>
            <div className={s.configRow}>
              <span className={s.configLabel}>Env key</span>
              <input
                className={s.configInput}
                value={envKey}
                onChange={(e) => setEnvKey(e.target.value.toUpperCase())}
                spellCheck={false}
                autoFocus
              />
            </div>
            <div className={s.configActions}>
              <Button size="sm" variant="ghost" width="auto" onClick={() => setSelected(null)}>Cancel</Button>
              <Button size="sm" width="auto" loading={isPending} onClick={() => void handleProvision()}>
                Provision
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
