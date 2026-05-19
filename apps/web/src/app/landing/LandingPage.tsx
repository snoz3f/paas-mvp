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
    desc: 'Подключи репо, и каждый пуш автоматически триггерит билд и деплой. Zero config.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 2v4M9 12v4M2 9h4M12 9h4" />
        <circle cx="9" cy="9" r="2.5" />
      </svg>
    ),
    title: 'Docker под капотом',
    desc: 'Каждый деплой — изолированный контейнер. Собираем через Dockerfile или автодетект.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 5h12M3 9h8M3 13h10" />
      </svg>
    ),
    title: 'Лог-стриминг в реальном времени',
    desc: 'Видишь вывод билда и рантайма прямо в браузере — без SSH, без tail -f.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="14" height="10" rx="2" />
        <path d="M6 9l1.5 1.5L10 8" />
      </svg>
    ),
    title: 'Веб-терминал',
    desc: 'Зайди в работающий контейнер прямо из дашборда. Полноценный интерактивный шелл.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 2C5.13 2 2 5.13 2 9s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z" />
        <path d="M9 6v3l2 2" />
      </svg>
    ),
    title: 'История деплоев',
    desc: 'Полный список деплоев с таймстампами и статусами. Редеплой одной кнопкой.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h10v10H4z" />
        <path d="M8 2v2M10 2v2M8 14v2M10 14v2M2 8h2M2 10h2M14 8h2M14 10h2" />
      </svg>
    ),
    title: 'Env Variables',
    desc: 'Храни секреты и конфиги в зашифрованном хранилище. Доступны в рантайме контейнера.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Подключи репозиторий',
    desc: 'Вставь GitHub-ссылку и (опционально) Personal Access Token для приватных репо и авто-деплоя.',
  },
  {
    num: '02',
    title: 'Задай окружение',
    desc: 'Выбери фреймворк, добавь env-переменные. INFRAL сам поднимет Docker и маршрутизацию.',
  },
  {
    num: '03',
    title: 'Push — и готово',
    desc: 'Каждый git push → webhook → билд → деплой. Логи в реальном времени прямо в браузере.',
  },
];

const PRICING = [
  {
    name: 'Hobby',
    amount: 'Бесплатно',
    amountAccent: false,
    desc: 'Для пет-проектов и экспериментов.',
    features: [
      '1 проект',
      '512 MB RAM',
      '1 деплой одновременно',
      'Логи 24ч',
      'Сообщество в TG',
    ],
    cta: 'Начать бесплатно',
    ctaPrimary: false,
    featured: false,
  },
  {
    name: 'Pro',
    amount: '$12',
    amountAccent: true,
    desc: 'Для фрилансеров и небольших команд.',
    features: [
      '10 проектов',
      '2 GB RAM на проект',
      'Параллельные деплои',
      'Логи 30 дней',
      'Кастомные домены',
      'Приоритетная поддержка',
    ],
    cta: 'Начать',
    ctaPrimary: true,
    featured: true,
  },
  {
    name: 'Team',
    amount: '$39',
    amountAccent: false,
    desc: 'Для продакшн-проектов и команд.',
    features: [
      'Неограниченно проектов',
      '8 GB RAM на проект',
      'Параллельные деплои',
      'Логи 90 дней',
      'Кастомные домены',
      'SLA 99.9%',
      'Выделенный канал поддержки',
    ],
    cta: 'Написать нам',
    ctaPrimary: false,
    featured: false,
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
          <a href="#how" className={s.navLink}>Как это работает</a>
          <a href="#pricing" className={s.navLink}>Цены</a>
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
          PaaS-платформа для СНГ-разработчиков. Push в git — приложение в продакшне.
          Никаких YAML, никаких кластеров.
        </p>

        <div className={s.heroActions}>
          <Link to="/register" className={s.heroBtnPrimary}>
            Задеплоить проект
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
          <a href="#how" className={s.heroBtnGhost}>
            Как это работает
          </a>
        </div>

        {/* Terminal mockup */}
        <div className={s.terminal}>
          <div className={s.terminalBar}>
            <span className={`${s.terminalDot} ${s.terminalDotRed}`} />
            <span className={`${s.terminalDot} ${s.terminalDotYellow}`} />
            <span className={`${s.terminalDot} ${s.terminalDotGreen}`} />
          </div>
          <div className={s.terminalBody}>
            <div className={s.terminalLine}>
              <span className={s.terminalPrompt}>$</span>
              <span className={s.terminalCmd}>git push origin main</span>
            </div>
            <div className={s.terminalLine}>
              <span className={s.terminalOut}>Enumerating objects: 5, done.</span>
            </div>
            <div className={s.terminalLine}>
              <span className={s.terminalOut}>To github.com:user/my-app.git</span>
            </div>
            <div className={s.terminalLine}>
              <span className={s.terminalOut}>   a1b2c3d..e4f5g6h  main → main</span>
            </div>
            <div className={s.terminalLine}>
              <span className={s.terminalPrompt}>›</span>
              <span className={s.terminalCmd}>INFRAL detected push · triggering deploy</span>
            </div>
            <div className={s.terminalLine}>
              <span className={s.terminalOut}>Building Docker image...</span>
            </div>
            <div className={s.terminalLine}>
              <span className={s.terminalOut}>Running npm ci · 312 packages installed</span>
            </div>
            <div className={s.terminalLine}>
              <span className={s.terminalSuccess}>✓ Deployed in 43s · my-app.infral.dev</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <div className={s.statsRow}>
        <div className={s.statItem}>
          <span className={s.statValue}>
            43<span className={s.statAccent}>s</span>
          </span>
          <span className={s.statLabel}>Среднее время деплоя</span>
        </div>
        <div className={s.statItem}>
          <span className={s.statValue}>
            <span className={s.statAccent}>99.9</span>%
          </span>
          <span className={s.statLabel}>Uptime SLA</span>
        </div>
        <div className={s.statItem}>
          <span className={s.statValue}>6</span>
          <span className={s.statLabel}>Фреймворков</span>
        </div>
      </div>

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

      {/* How it works */}
      <div className={s.divider} />
      <section className={s.section} id="how">
        <p className={s.sectionLabel}>Как это работает</p>
        <h2 className={s.sectionTitle}>Три шага до продакшна</h2>
        <p className={s.sectionSub}>
          От пустого репозитория до работающего приложения
          — за несколько минут.
        </p>
        <div className={s.stepsRow}>
          <div className={s.stepsConnector} />
          {STEPS.map((step) => (
            <div key={step.num} className={s.stepItem}>
              <div className={s.stepNum}>{step.num}</div>
              <p className={s.stepTitle}>{step.title}</p>
              <p className={s.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <div className={s.divider} />
      <section className={s.section} id="pricing">
        <p className={s.sectionLabel}>Цены</p>
        <h2 className={s.sectionTitle}>Просто и честно</h2>
        <p className={s.sectionSub}>
          Платишь только за то, что используешь. Никаких скрытых комиссий.
        </p>
        <div className={s.pricingGrid}>
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={plan.featured ? s.pricingCardFeatured : s.pricingCard}
            >
              {plan.featured && <span className={s.pricingBadge}>Популярный</span>}
              <p className={s.pricingName}>{plan.name}</p>
              <div className={s.pricingPrice}>
                <span className={plan.amountAccent ? s.pricingAmountAccent : s.pricingAmount}>
                  {plan.amount}
                </span>
                {plan.amountAccent && <span className={s.pricingPeriod}>/мес</span>}
              </div>
              <p className={s.pricingDesc}>{plan.desc}</p>
              <ul className={s.pricingFeatures}>
                {plan.features.map((f) => (
                  <li key={f} className={s.pricingFeatureRow}>
                    <svg className={s.pricingCheck} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 7l3.5 3.5L12 3" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={plan.ctaPrimary ? s.pricingBtnPrimary : s.pricingBtn}
              >
                {plan.cta}
              </Link>
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
            <a href="#pricing" className={s.footerLink}>Цены</a>
            <a href="https://t.me/infraldev" className={s.footerLink}>Telegram</a>
          </div>
          <span className={s.footerCopy}>© 2026 INFRAL</span>
        </div>
      </footer>
    </div>
  );
}
