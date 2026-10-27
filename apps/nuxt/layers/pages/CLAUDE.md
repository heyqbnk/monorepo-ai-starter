# Слой pages

Все страницы приложения живут в этом слое: в нём лежат все компоненты страниц и связанные с ними
утилиты. У каждой страницы своя директория в `app/components`.

Такая раскладка снижает когнитивную нагрузку и упрощает удаление страниц: удаление одной
директории убирает страницу и почти всё, что к ней относится.

`utils`, `composables` и `stores` внутри директории страницы — глобальные auto-imports
(`imports.dirs` в `nuxt.config.ts`): так функции навигации страницы доступны во всём приложении.
Хелперы, нужные только самой странице, клади в приватные `_utils/`, `_composables/`.

## Регистрация страницы

1. Добавь идентификатор страницы в `app/utils/PageNames.ts`. В этом файле лежит enum, которым
   приложение идентифицирует маршруты страниц.

2. В Nuxt нет простого способа держать компонент страницы рядом со связанными с ним компонентами,
   поэтому сами реализации страниц лежат в `app/components`, по директории на страницу. Когда
   компонент готов, сделай страницу видимой для Nuxt: создай `apps/nuxt/app/pages/<route>.vue`
   примерно такого вида:

```vue
<script lang="ts" setup>
definePageMeta({ name: PageNames.NewRoute });
</script>

<template>
  <NewRoutePage/>
</template>
```

## Nav params

Страница определяется не только именем: ей могут требоваться path-параметры, query-параметры или
и то и другое. Собирать этот объект руками в каждом месте вызова небезопасно: ничто не мешает
пропустить обязательный параметр или опечататься в ключе, а ошибка вылезет только в рантайме как
сломанный маршрут.

Поэтому каждая страница предоставляет функцию, собирающую её route location. Она лежит в
директории `utils` страницы и называется по имени страницы с префиксом `create` и суффиксом
`PageNavParams` — `createProductPageNavParams`, `createProfilePageNavParams` и так далее.
Функция принимает обязательные параметры страницы и возвращает location, никуда не переходя:

```typescript
export function createProductPageNavParams(options: {
  id: string;
}) {
  return {
    name: PageNames.Product,
    params: { id: options.id },
  };
}
```

Именно это по всему проекту передаётся в проп `to` у `NuxtLink`, так что ссылку нельзя направить
на страницу, не передав то, что ей нужно:

```vue
<NuxtLink :to="createProductPageNavParams({ id })"/>
```

Страницам без параметров функция тоже нужна: она не принимает аргументов и сохраняет места вызова
единообразными, так что `PageNames` никогда не приходится использовать в шаблоне напрямую:

```typescript
export function createHomePageNavParams() {
  return { name: PageNames.Home };
}
```

## Навигация

Каждая страница предоставляет глобально доступную функцию навигации, чтобы типизированные
параметры страницы проверялись в каждом месте вызова. В директории `utils` страницы лежит по
файлу на функцию, названному по её имени: префикс `navigateTo`, суффикс `Page` —
`navigateToProductPage`, `navigateToProfilePage` и так далее. Функция возвращает результат
`navigateTo`, чтобы вызывающий код мог его await-ить.

Собирай location через `create*PageNavParams` страницы, а не повторяй литерал объекта, — так
параметры страницы определены ровно в одном месте.

Каждая функция навигации принимает второй, необязательный параметр `navOptions` типа
`PageNavOptions` (из `~pages/types`) и передаёт его прямо в `navigateTo`. Он управляет тем, *как*
происходит переход, а не тем, *куда* он ведёт. Сейчас там только `replace` — заменить текущую
запись истории вместо добавления новой:

```typescript
import type { PageNavOptions } from '~pages/types';

export function navigateToProductPage(options: {
  id: string;
}, navOptions?: PageNavOptions) {
  return navigateTo(createProductPageNavParams(options), navOptions);
}
```

Держи его отдельным параметром — никогда не складывай `replace` в объект параметров страницы,
иначе параметры страницы и поведение навигации в месте вызова станет не различить. Страницы без
параметров принимают `navOptions` единственным аргументом:

```typescript
export function navigateToHomePage(navOptions?: PageNavOptions) {
  return navigateTo(createHomePageNavParams(), navOptions);
}
```

`create*PageNavParams` **не** принимает `navOptions`: она собирает route location, а `replace`
в него не входит.

Используй `navigateToXxxPage({ replace: true })`, а не прямые вызовы `navigateTo`/`router.replace`,
чтобы любая навигация на страницу шла через функцию этой страницы.

Если перед переходом нужно заполнить store (данные слишком большие или не сериализуются в
query-параметры), вместо функции сделай composable `useNavigateToXxxPage` в директории
`composables` страницы — ему нужен контекст Nuxt, чтобы добраться до store. Возвращаемая функция
принимает те же два параметра.

## Preload

У каждой страницы есть функция preload с теми же обязательными параметрами. Она лежит рядом с
функцией навигации в директории `utils` страницы и называется по имени страницы с префиксом
`preload` и суффиксом `Page` — `preloadProductPage`, `preloadProfilePage` и так далее:

```typescript
export function preloadProductPage(options: {
  id: string;
}) {
  preloadRouteComponents(createProductPageNavParams(options));
}
```

Страницам без параметров тоже нужна отдельная функция, без аргументов.
