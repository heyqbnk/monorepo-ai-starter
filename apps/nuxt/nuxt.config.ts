import tailwindcss from '@tailwindcss/vite';
import browserslistToEsbuild from 'browserslist-to-esbuild';

import { createCssModuleScopedName } from './config/createCssModuleScopedName';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $development: {
    vite: {
      css: {
        modules: {
          generateScopedName: createCssModuleScopedName({
            rootDir: import.meta.dirname,
            withComponentName: true,
          }),
        },
      },
    },
  },
  $production: {
    vite: {
      css: {
        modules: {
          generateScopedName: createCssModuleScopedName({
            rootDir: import.meta.dirname,
            withComponentName: false,
          }),
        },
      },
    },
  },
  appId: 'repo-nuxt',
  modules: ['@nuxt/eslint', '@nuxtjs/i18n'],
  app: {
    head: {
      style: [
        {
          // Cascade layer order is set by the first stylesheet mentioning a layer. In dev a
          // component's stylesheet may come before Tailwind's, putting `components` before
          // `base`, so the order is declared ahead of all stylesheets.
          innerHTML: '@layer theme, base, components, utilities;',
          tagPriority: 'critical',
        },
      ],
    },
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
      extensions: ['.vue'],
      // Private helpers (`_components/`, `_Foo.vue`) stay local to their folder.
      ignore: ['**/_/**', '**/_*'],
    },
  ],
  devtools: { enabled: true },
  experimental: {
    // Disables loading `_payload.json` between navigations. The file is only useful
    // with a server rendering pages on demand.
    payloadExtraction: false,
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2026-10-25',
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Resolved from .browserslistrc.
      target: browserslistToEsbuild(undefined, { path: import.meta.dirname }),
    },
  },
  typescript: {
    // Type checking runs on `nuxt build` only, so it doesn't slow down `nuxt dev`.
    typeCheck: 'build',
    appTsConfig: {
      vueCompilerOptions: {
        // Type checking fails on template tags that resolve to no known component.
        checkUnknownComponents: true,
      },
    },
  },
  i18n: {
    // Messages live in components (`useI18n({ messages })`), so there are no locale files.
    locales: [
      { code: 'en', language: 'en-US' },
      { code: 'ru', language: 'ru-RU' },
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
  },
});
