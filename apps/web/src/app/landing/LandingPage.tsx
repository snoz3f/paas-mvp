import { Link } from 'react-router';
import * as s from './landing.css';

const FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="14" height="14" rx="3" />
        <path d="M6 9l2 2 4-4" />
      </svg>
    ),
    title: 'Git push → deploy',
    desc: 'Подключи репо, и каждый пуш собирает образ через Railpack или Dockerfile и выкатывает контейнер.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="5" height="5" rx="1" />
        <rect x="10" y="3" width="5" height="5" rx="1" />
        <rect x="3" y="10" width="5" height="5" rx="1" />
      </svg>
    ),
    title: 'Static, Node, Python',
    desc: 'Три стека. Без YAML и без кластера — выбрал репо, указал стек, получил URL.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 5h12M3 9h8M3 13h10" />
      </svg>
    ),
    title: 'Лог-стриминг в реальном времени',
    desc: 'Видишь вывод билда прямо в браузере — без SSH, без tail -f.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h10v10H4z" />
        <path d="M8 2v2M10 2v2M8 14v2M10 14v2M2 8h2M2 10h2M14 8h2M14 10h2" />
      </svg>
    ),
    title: 'Env Variables',
    desc: 'Секреты и конфиги в приложении. Доступны в рантайме контейнера.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="9" cy="5" rx="6" ry="2.5" />
        <path d="M3 5v8c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V5" />
      </svg>
    ),
    title: 'Postgres и Redis',
    desc: 'Managed-сервисы в сети проекта. Connection string копируешь в env приложения.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 2C5.13 2 2 5.13 2 9s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z" />
        <path d="M9 6v3l2 2" />
      </svg>
    ),
    title: 'История деплоев',
    desc: 'Список деплоев со статусами. Редеплой одной кнопкой.',
  },
];

export function LandingPage() {
  return (
    <div className={s.page}>
      <div className={s.dotGrid} />
      <div className={s.glow} />

      {/* Navbar */}
      <nav className={s.nav}>
        <Link to="/" className={s.navBrand}>
          <span className={s.navBrandName}>INFRAL</span>
          <span className={s.navCursor}>_</span>
        </Link>

        <div className={s.navLinks}>
          <a href="#features" className={s.navLink}>Возможности</a>
        </div>

        <div className={s.navActions}>
          <Link to="/login" className={s.navBtnGhost}>Войти</Link>
          <Link to="/register" className={s.navBtnPrimary}>Начать →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className={s.hero}>
        <div className={s.heroBadge}>
          <span className={s.heroBadgeDot} />
          Открытое бета-тестирование
        </div>

        <h1 className={s.heroTitle}>
          Деплой без{' '}
          <span className={s.heroAccent}>лишнего</span>
        </h1>

        <p className={s.heroSub}>
          PaaS для Static, Node и Python. Push в git — живой URL на *.infral.dev.
          Никаких YAML, никаких кластеров.
        </p>

        <div className={s.heroActions}>
          <Link to="/register" className={s.heroBtnPrimary}>
            Задеплоить проект
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
          <a href="#features" className={s.heroBtnGhost}>
            Как это работает
          </a>
        </div>

        <div className={s.heroCode}>
          <span className={s.heroCodePrompt}>$</span>
          <span className={s.heroCodeText}>git push origin main</span>
          <span style={{ color: '#4dff91', fontSize: '12px', fontFamily: 'inherit' }}>✓ deployed in 43s</span>
        </div>
      </section>

      {/* Features */}
      <div className={s.divider} />
      <section className={s.section} id="features">
        <p className={s.sectionLabel}>Возможности</p>
        <h2 className={s.sectionTitle}>Всё что нужно для деплоя</h2>
        <p className={s.sectionSub}>
          Без лишних абстракций. Только то, что реально нужно
          чтобы запустить приложение.
        </p>
        <div className={s.featuresGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} className={s.featureCard}>
              <div className={s.featureIcon}>{f.icon}</div>
              <p className={s.featureTitle}>{f.title}</p>
              <p className={s.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className={s.ctaSection}>
        <div className={s.ctaCard}>
          <h2 className={s.ctaTitle}>Готов задеплоить?</h2>
          <p className={s.ctaSub}>
            Регистрация занимает 30 секунд. Первый проект — бесплатно.
          </p>
          <Link to="/register" className={s.heroBtnPrimary}>
            Начать бесплатно
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className={s.footer}>
          <span className={s.footerBrand}>INFRAL_</span>
          <div className={s.footerLinks}>
            <a href="#features" className={s.footerLink}>Возможности</a>
            <a href="https://t.me/infraldev" className={s.footerLink}>Telegram</a>
          </div>
          <span className={s.footerCopy}>© 2026 INFRAL</span>
        </div>
      </footer>
    </div>
  );
}
