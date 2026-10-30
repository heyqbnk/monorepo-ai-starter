# nuxt

Nuxt-приложение. Общие для репозитория правила — в корневом AGENTS.md.

## Команды

Запускаются из корня репозитория. Корневые `pnpm lint` / `pnpm typecheck` прогоняют turbo-задачу
во всех пакетах; чтобы ограничиться этим приложением, добавь фильтр:
`pnpm --filter @repo/nuxt <скрипт>`.

| | |
|---|---|
| `pnpm --filter @repo/nuxt dev` | запустить dev-сервер |
| `pnpm --filter @repo/nuxt lint` / `lint:fix` | ESLint и Stylelint (и автоисправление) |
| `pnpm --filter @repo/nuxt typecheck` | проверка типов TypeScript (через `vue-tsc`) |
| `pnpm --filter @repo/nuxt build` | проверка типов и production-сборка |

**Чтобы проверить изменение, запусти `lint`, затем `typecheck`.** Не запускай `build` только ради
проверки типов: `nuxt.config.ts` задаёт `typescript.typeCheck: 'build'`, так что сборка типы
проверяет, но она намного медленнее.

## Имена компонентов

Имя компонента состоит из нескольких слов, как требует
[style guide Vue](https://vuejs.org/style-guide/rules-essential.html#use-multi-word-component-names):
так оно не совпадёт с существующими и будущими HTML-элементами. Если естественное имя — одно
слово, к нему добавляется префикс `V`: `VImage`, `VTypo`. У имён из нескольких слов префикса нет:
`ProcessedImage`, а не `VProcessedImage`; `UseTypo`, а не `VUseTypo`.

## Слои

`layers/*` — слои (Nuxt layers) приложения: всё, чему нужен рантайм Nuxt (компоненты,
composables, stores, auto-imports). Nuxt сам регистрирует каждую директорию здесь, ручная
настройка не нужна. Чистый TS, который пригодится другим приложениям, выноси в `packages/*`.

Общие правила для всех слоёв:

- У каждого слоя есть `nuxt.config.ts` с alias `~<layer>`, указывающим на его папку `app`
  (например, `~ui-kit`). Между слоями импортируй через эти aliases. Пример:
  ```typescript
  import path from 'node:path';

  function resolve(...filePath: string[]) {
    return path.resolve(__dirname, ...filePath);
  }

  export default defineNuxtConfig({
    alias: {
      '~layer-name': resolve('app'),
    },
  });
  ```
- `$meta.name` в Nuxt-конфиге совпадает с именем слоя.

## Страницы

Все страницы живут в слое `pages`, по директории на страницу в `layers/pages/app/components`.
Правила (регистрация, nav params, навигация, preload) — в `layers/pages/AGENTS.md`.

Эти правила действуют везде, а не только внутри слоя `pages`:

- **Ссылки — через `create<Name>PageNavParams()`**: `<NuxtLink :to="createProductPageNavParams({ id })">`.
  Никогда не используй `PageNames` в шаблоне и не пиши route location руками.
- **Навигация — через `navigateTo<Name>Page(options, navOptions?)`** (или `useNavigateTo<Name>Page`,
  если он есть), в том числе replace: `navigateToHomePage({ replace: true })`. Не вызывай
  `navigateTo`/`router.push`/`router.replace` для страницы напрямую.
- **Preload — через `preload<Name>Page()`.**

## Соглашения

- **Префикс `_` означает приватность.** Glob-паттерны auto-imports везде исключают `**/_/**` и
  `**/_*`. `_components/`, `_api/`, `_composables/` внутри папки компонента видны только в этой
  папке — используй их, вместо того чтобы выносить хелперы в глобальные auto-imports.
- **Имена компонентов глобальные и плоские.** `pathPrefix: false`, поэтому имя файла *и есть*
  зарегистрированное имя; оно должно быть уникальным во всём приложении и всех слоях. Новый слой
  повторяет секцию `components` из `layers/ui-kit/nuxt.config.ts`.
- **Включён `checkUnknownComponents`** (`vueCompilerOptions` в `nuxt.config.ts`). Неразрешённый
  тег в шаблоне — ошибка `pnpm typecheck`, а не custom element.
- **Ключи объектов — по алфавиту**, включая деструктуризацию и сообщения i18n. Это проверяет
  `perfectionist/sort-objects` в `pnpm lint`, а `pnpm lint:fix` расставляет ключи сам. Пустая
  строка начинает новую группу, которая сортируется отдельно: так можно сохранить группировку
  по смыслу. Комментарий над ключом переезжает вместе с ним, поэтому комментарий, который
  описывает целый блок, пиши над ключом этого блока, а не над первым ключом внутри.
- **i18n живёт в компоненте**, а не в файлах локалей:
  ```ts
  const { t } = useI18n({
    messages: {
      en: { title: 'Language' },
      ru: { title: 'Язык' },
    }
  });
  ```
  Файлов локалей нет намеренно: `@nuxtjs/i18n` настроен без `langDir`, локали `en` и `ru`
  (обе обязательны), стратегия `no_prefix`.

  Вложенные ключи записывай объектами, а не плоскими ключами с точкой; все ключи — в camelCase.
  Обращение не меняется: `t('subscribe.perMonth')`.
  ```ts
  // ✅
  en: { subscribe: { perMonth: 'Subscribe for a month' } },
  // ❌
  en: { 'subscribe.perMonth': 'Subscribe for a month', subscribe_per_year: '…' },
  ```

  **В компоненте — один `useI18n` с `messages`.** Второй вызов с локальными `messages` в том же
  компоненте (в том числе изнутри composable) не работает и даёт предупреждение
  `Duplicate useI18n calling by local scope`. Поэтому composable со своими переводами не
  вызывает `useI18n` сам: он экспортирует сообщения константой, а `t`/`locale` принимает от
  компонента. Компонент добавляет эти сообщения в свой `useI18n`:
  ```ts
  const { t, locale } = useI18n({
    messages: {
      en: { ...priceFormatterMessages.en, subscribe: 'Subscribe' },
      ru: { ...priceFormatterMessages.ru, subscribe: 'Подписаться' },
    },
  });
  const { formatPeriod } = usePriceFormatter({ t, locale });
  ```

### Tailwind или CSS module

**Если стили элемента укладываются в 4 простых свойства или меньше, пиши их утилитами Tailwind
прямо в `class`** шаблона: `class="grid gap-4"`, `class="text-center"`. Простое свойство —
то, что выражается одной утилитой: отступы, размеры, flex/grid, выравнивание, цвет текста.
Произвольные значения тоже простые (`max-w-[500px]`, `rounded-[14px]`), если в них нет `calc()`.

**Всё остальное — класс в CSS module:**

- больше 4 свойств;
- сложные значения: градиенты, многослойные `background`/`box-shadow`, `mask`, `filter`,
  `backdrop-filter`, `clip-path`, `transition`/`animation`, значения с `calc()`
  (`h-[calc(100dvh-56px)]`);
- медиазапросы, псевдоэлементы и SCSS-миксины;
- элемент, который переключает стили по состоянию: модификатор — класс модуля, а не выбор
  между утилитами.

Не дроби стили одного элемента между утилитами и классом модуля: если элементу нужен класс
модуля, все его стили живут в этом классе. `@reference`/`@apply` в блоках стилей не
используются.

**Исключение — корень компонента ui-kit:** у него всегда есть класс `cn.root`, и все стили
корня описываются в нём, даже если их меньше 4. Внутренние элементы ui-kit подчиняются
общему правилу: простые стили — утилитами, остальное — классом модуля.

## Стили компонентов

Часть правил ниже проверяют stylelint (`stylelint.config.mjs`) и eslint (`eslint.config.mjs`,
запрет scoped CSS). Оба запускаются в `pnpm lint` (`pnpm lint:fix` — с автоисправлением). Если
без нарушения никак, отключи правило для строки и объясни причину после `--`:
`/* stylelint-disable-next-line selector-nested-pattern -- <почему> */`. Без причины линтер не
пропустит. Комментарии `//` работают только в SCSS: в `<style module="cn">` без `lang` и в
`.css`-файлах пиши `/* … */`.

**Scoped CSS не используется вообще** — ни `<style scoped>`, ни `<style lang="scss" scoped>`.
Собственные классы компонента пишутся в CSS modules: `<style lang="scss" module="cn">`
(без `lang`, если SCSS не нужен), в шаблоне — `:class="cn.title"`. Так пишутся все компоненты,
включая ui-kit.

- Имена классов — camelCase, короткие и локальные: `.root`, `.qrCode`. Модификатор — отдельный
  класс с суффиксом-состоянием (`.qrCodeStub`, `.slideHidden`), который ставится вместе с
  базовым: `:class="[cn.slide, !link && cn.slideHidden]"`.
- Классы для `<Transition>` передаются через `*-class`-пропсы:
  `:enter-active-class="cn.fadeActive"`, `:enter-from-class="cn.fadeHidden"`.
- Класс для элемента вне шаблона (например, `<body>` через `useHead`) — `cn['body']`.

**Чем ниже специфичность, тем лучше.** Селектор — один класс: `.qrCodeStub`, а не
`.qrCode.stub` и не `.root .qrCode`. Модификатор перебивает базовый класс за счёт порядка,
поэтому объявляй его после базового. Цепочки классов, вложенные селекторы и `!important` —
только если без них никак; тогда оставь комментарий почему. Псевдоклассы и псевдоэлементы
(`:hover`, `::after`) этим правилом не запрещены.

### Компоненты ui-kit

Компоненты слоя `ui-kit` пишутся на CSS modules по правилам выше, с дополнениями. Имена
компонентов, файлов и CSS-переменных в примерах (`ButtonBase`, `VImage`, `typo.module.css`…)
условные — в слое их может не быть. Эталон, где применены все эти правила, —
`layers/ui-kit/app/components/button/VButton.vue`.

- **Модификатор по значению пропа — через явную карту** в `<script>`, а не склейкой имени
  класса из строки:
  ```ts
  const cn = useCssModule('cn');

  const variantClasses: Record<ButtonVariant, string | undefined> = {
    large: cn.rootLarge,
    small: cn.rootSmall,
  };
  ```
  ```vue
  <ButtonBase :class="[cn.root, variantClasses[variant], slots.icon && cn.rootWithIcon]">
  ```
  Так каждый класс находится поиском, а новое значение пропа TypeScript не даст забыть.
- **Не обращайся к классам другого компонента:** они локальны для его модуля, а в production
  это хэш. Родитель меняет вид дочернего компонента классом через `class` (он ложится на корень
  дочернего), CSS-переменной, которую дочерний читает (`--button-base-pressed-scale` в
  `ButtonBase`), или пропом.
- **Классы, которые ставит TS-код** (composable, хелпер анимации), живут в `*.module.scss` /
  `*.module.css` рядом с ним и импортируются как модуль: `import cn from './typo.module.css';`.
- `@keyframes` в модуле тоже локальны, поэтому имена у них короткие: `enter`, `leave`.

**Правила компонента кладутся в `@layer components`.** Утилиты Tailwind живут в
`@layer utilities`, а стили вне слоёв побеждают любые слоистые независимо от специфичности —
без слоя утилиты, переданные компоненту через `class` (`<VImage class="w-10">`), молча
проигрывают его собственным правилам. Порядок слоёв (`theme, base, components, utilities`)
объявлен inline-стилем в `app.head` в `nuxt.config.ts`: в dev стили компонента могут попасть в
документ раньше Tailwind, и тогда `components` встал бы перед `base`. Не убирай это объявление.
`@use`, переменные, `@mixin`, `@property` и `@keyframes` остаются вне слоя:
```scss
// The components layer lets utilities passed through `class` override these rules.
@layer components {
  .root {
    // ...
  }
}
```

Порядок в модуле: сначала корень `.root` и его модификаторы, затем элементы, у каждого
модификаторы сразу после него. Цвета — CSS-переменные, не hex и не именованные цвета.
Переменные цветов объявлены в `layers/ui-kit/app/assets/css/colors.css`; нужен новый цвет —
добавь переменную туда.
