# nuxt

## Имена компонентов

Имя компонента состоит из нескольких слов, как требует
[style guide Vue](https://vuejs.org/style-guide/rules-essential.html#use-multi-word-component-names):
так оно не совпадёт с существующими и будущими HTML-элементами. Если естественное имя — одно
слово, к нему добавляется префикс `V`: `VImage`, `VTypo`. У имён из нескольких слов префикса нет:
`ProcessedImage`, а не `VProcessedImage`; `UseTypo`, а не `VUseTypo`.

## Слои

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

## Соглашения

- **Префикс `_` означает приватность.** Glob-паттерны auto-imports везде исключают `**/_/**` и
  `**/_*`. `_components/`, `_api/`, `_composables/` внутри папки компонента видны только в этой
  папке — используй их, вместо того чтобы выносить хелперы в глобальные auto-imports.
- **Имена компонентов глобальные и плоские.** `pathPrefix: false`, поэтому имя файла *и есть*
  зарегистрированное имя; оно должно быть уникальным во всём приложении и всех слоях. Новый слой
  повторяет секцию `components` из `layers/ui-kit/nuxt.config.ts`.
- **Включён `checkUnknownComponents`** (`vueCompilerOptions` в `nuxt.config.ts`). Неразрешённый
  тег в шаблоне — ошибка `pnpm typecheck`, а не custom element.
- **i18n живёт в компоненте**, а не в файлах локалей:
  ```ts
  const { t } = useI18n({
    messages: {
      en: { title: 'Language' },
      ru: { title: 'Язык' },
    }
  });
  ```
  Файлов локалей нет намеренно: `@nuxtjs/i18n` настроен без `langDir`, локали `en` и `ru`,
  стратегия `no_prefix`.

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
условные — в слое их может не быть.

- **Модификатор по значению пропа — через явную карту** в `<script>`, а не склейкой имени
  класса из строки:
  ```ts
  const cn = useCssModule('cn');

  const variantClasses: Record<ButtonVariant, string | undefined> = {
    small: cn.rootSmall,
    large: cn.rootLarge,
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
проигрывают его собственным правилам. `@use`, переменные, `@mixin`, `@property` и `@keyframes`
остаются вне слоя:
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
