# INFRAL — запуск на трёх стеках

Дата: 2026-09-17
Статус: утверждён в разборе, ждёт ревью файла

Путь: `plans/` — `/docs` в репозитории в `.gitignore`.

## Цель

Сузить продукт до запускаемого среза: GitHub → билд → `https://<deployment>.infral.dev` для **Static**, **Node**, **Python**. Postgres и Redis в проекте остаются. Терминал, биллинг и кастомные домены прячем из UI. Воркер и Railpack не кастрируем.

Успех: новый пользователь регистрируется, создаёт приложение с обязательным стеком, деплоит, видит логи и URL. Может добавить Postgres/Redis и прописать connection string в env.

## Не цели

- Не удалять terminal gateway, `getTerminalInfo`, поле `domain`, provision-service.
- Не учить воркер смотреть на `framework` и не запрещать Dockerfile / чужие стеки на уровне сборки.
- Не делать биллинг, тарифы, roadmap на лендинге.
- Не менять схему Prisma и не мигрировать старые приложения.

## Стек как ярлык

Пикер — продуктовый ярлык, не способ сборки.

| Значение в API/БД | Подпись в UI |
|---|---|
| `static` | Static |
| `node` | Node |
| `python` | Python |

Других значений нет. `null` допустим только у приложений, созданных до этого среза.

Пикер обязателен при создании. После создания стек не меняется ни в UI, ни через API. На порт, root dir, env и Railpack не влияет.

## Поверхность продукта

### Лендинг (`apps/web/src/app/landing/LandingPage.tsx`)

Убрать:

- секцию `#pricing`, массив `PRICING`, ссылки «Цены» в навбаре и футере;
- карточку фичи «Веб-терминал»;
- любые обещания кастомных доменов и тарифов.

Оставить / добавить:

- бета-бейдж;
- git push → deploy, логи, env vars, Docker/Railpack под капотом, история деплоев;
- явное обещание трёх стеков: Static, Node, Python;
- Postgres и Redis как infra в проекте — можно одной фичей, без каталога «mini-AWS»;
- CTA на регистрацию. Формулировки вроде «первый проект бесплатно» допустимы: это не таблица тарифов.

Roadmap / блок Later на лендинг не ставить.

### Создание приложения (`NewAppPage.tsx`)

На форме обязательный выбор одного из трёх. Без выбора submit не проходит (ошибка на форме, запрос не уходит).

Пикер не выставляет порт и не подсказывает build command / Procfile.

`createApp` всегда отправляет `framework: 'static' | 'node' | 'python'`.

Стили — Vanilla Extract, токены из `tokens.css.ts` (skill `paas-design`).

### Карточка приложения (`AppPage.tsx`)

Поле Framework уже есть. Показывать подпись из таблицы выше; при `null` — «—».

Блок «Domain» на карточке — это live URL деплоя (`activeDeployment.url`, обычно `*.infral.dev`). Его не трогаем: это не кастомный домен.

Стек в Settings не редактируется.

### Settings приложения (`AppSettingsModal.tsx`)

Оставить: имя, root dir, env vars.

Убрать с формы: Custom domain и CNAME-подсказку.

Сохранение **не должно** слать `domain` (ни значение, ни `null`). Иначе существующий домен в БД затрётся.

Проп `appDomain` можно перестать передавать, если после вырезания поля он не нужен.

### Деплой (`DeploymentPage.tsx`)

Только логи. Вкладку Terminal, тип `'terminal'`, вызов `getTerminalInfo` и XTerm-шелл убрать с этой страницы.

Restart / stop / стрим логов без изменений.

### Дашборд

Убрать пункт Billing из `DashboardLayout` и роут `/dashboard/billing` из `App.tsx`. Заход по старому URL — редирект на `/dashboard`.

Заглушку Settings (`/dashboard/settings`) не трогать.

Админка `/admin` и ноды — без изменений.

### Проект и infra

`ProjectPage`, `NewServicePanel`, Postgres/Redis — без изменений. `envKey` и connection string по-прежнему копируются руками в env приложения.

## Контракт API

Источник правды: `apps/api/src/trpc/app-router.ts`. Prisma `App.framework String?` не меняем: ограничение на границе API.

### Типы

```ts
type AppFramework = 'static' | 'node' | 'python';

interface App {
  framework: AppFramework | null;
  // остальное без изменений, включая domain
}
```

`AppRouterDeps.createApp`: `framework: AppFramework` (обязателен).

`AppRouterDeps.updateApp`: поля `framework` нет.

### `apps.create`

```ts
framework: z.enum(['static', 'node', 'python'])
```

Нет поля, пустая строка, `go` / `php` / `nestjs` → Zod `BAD_REQUEST`, запись не создаётся.

REST `CreateAppDto`: то же, required, `IsIn(['static', 'node', 'python'])`.

### `apps.update`

Удалить `framework` из input (tRPC и `UpdateAppDto`). Имя, repo, root dir, domain, port, env vars, gitToken, ресурсы — как сейчас.

`domain` в update **оставляем**. UI его не шлёт. Воркеру поле ещё нужно.

### Что не трогаем в API

- `deployments.getTerminalInfo`
- `services.*`
- `nodes.*`
- GitHub OAuth, webhooks, scheduler

`trpc.service.ts`: прокинуть обязательный `framework` в create; в update больше не принимать и не писать `framework`.

## Билд (вне скоупа правок)

Воркер (`paas-worker`) не меняем.

Как сейчас: clone → Dockerfile ? `docker build` : Railpack → контейнер → `*.infral.dev` (или `app.domain`, если задан). `framework` в job не передаём.

Репо с Dockerfile на Go по-прежнему соберётся. В продукте этого нет.

Порт: EXPOSE образа, иначе Caddy → 80, иначе `job.port ?? 3000`. Стек порт не ставит.

Ошибки клона/билда/запуска — как сейчас, в логах деплоя.

## Ошибки

| Ситуация | Поведение |
|---|---|
| Создать приложение без пикера | Клиентская валидация, запрос не уходит |
| `apps.create` без framework или с чужим значением | `BAD_REQUEST`, нет строки в БД |
| `apps.update` с `framework` в body | поле не в схеме, стек не меняется |
| Старое приложение, `framework = null` | бейдж «—», деплой работает |
| Railpack/Docker упал | FAILED + логи, как сейчас |

## Файлы

| Файл | Что сделать |
|---|---|
| `apps/web/src/app/landing/LandingPage.tsx` | стеки, вырезать цены и терминал, без roadmap |
| `apps/web/src/app/landing/landing.css.ts` | убрать неиспользуемые стили прайсинга, если останутся мёртвыми |
| `apps/web/src/app/dashboard/projects/NewAppPage.tsx` | обязательный пикер, слать `framework` |
| `apps/web/src/app/dashboard/projects/NewProjectPage.css.ts` | стили пикера (NewAppPage уже импортирует этот файл) |
| `apps/web/src/app/dashboard/projects/AppPage.tsx` | подписи стека; не передавать domain в settings, если проп уйдёт |
| `apps/web/src/app/dashboard/projects/AppSettingsModal.tsx` | вырезать domain; не слать `domain` при save |
| `apps/web/src/app/dashboard/projects/DeploymentPage.tsx` | только логи |
| `apps/web/src/app/dashboard/DashboardLayout.tsx` | убрать Billing |
| `apps/web/src/App.tsx` | убрать billing-роут, редирект |
| `apps/api/src/trpc/app-router.ts` | enum create, убрать framework из update, тип `App.framework` |
| `apps/api/src/trpc/trpc.service.ts` | create требует framework; update его не пишет |
| `apps/api/src/apps/dto/create-app.dto.ts` | required enum |
| `apps/api/src/apps/dto/update-app.dto.ts` | убрать framework |
| `apps/api/src/apps/apps.service.ts` | если update сейчас копирует framework из DTO — перестать |

Не трогать: `paas-worker`, Prisma schema, services, nodes, webhooks, Redis logs.

## Проверка

Руками, как пользователь:

1. Лендинг: нет «Цены» в навбаре/футере/секциях; нет терминала в фичах; видны Static / Node / Python; нет roadmap.
2. Регистрация → проект → New app: без пикера создать нельзя.
3. Создать с Python: на AppPage «Python»; settings без домена; env vars работают.
4. Deploy page: нет вкладки Terminal, логи есть.
5. В сайдбаре нет Billing; `/dashboard/billing` → `/dashboard`.
6. Добавить Postgres в проект — каталог на месте.

Контракт:

- `apps.create` без `framework` или с `"go"` падает.
- `apps.create` с `"python"` проходит.
- `apps.update` с `framework` не меняет стек.

Воркер регрессией этого среза не гоняем: его не меняем.

## Вне скоупа, сознательно

- Env vars UI — уже есть, не переписываем.
- Auto-deploy webhook — оставляем.
- Кастомный домен в API и воркере — оставляем, UI не показывает.
- Мульти-ноды, админка, лимиты RAM/CPU/Disk — оставляем.
- Удаление мёртвого backend-кода терминала — не в этом срезе.
