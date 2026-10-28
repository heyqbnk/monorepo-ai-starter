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
  appId: 'repo-nuxt',
  compatibilityDate: '2026-10-25',
  components: [
    {
      extensions: ['.vue'],
      // Private helpers (`_components/`, `_Foo.vue`) stay local to their folder.
      ignore: ['**/_/**', '**/_*'],
      path: '~/components',
      pathPrefix: false,
    },
  ],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  experimental: {
    // Disables loading `_payload.json` between navigations. The file is only useful
    // with a server rendering pages on demand.
    payloadExtraction: false,
  },
  // Messages live in components (`useI18n({ messages })`), so there are no locale files.
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US' },
      { code: 'ru', language: 'ru-RU' },
    ],
    strategy: 'no_prefix',
  },
  modules: ['@nuxt/eslint', '@nuxtjs/i18n'],
  typescript: {
    appTsConfig: {
      vueCompilerOptions: {
        // Type checking fails on template tags that resolve to no known component.
        checkUnknownComponents: true,
      },
    },
    // Type checking runs on `nuxt build` only, so it doesn't slow down `nuxt dev`.
    typeCheck: 'build',
  },
  vite: {
    build: {
      // Resolved from .browserslistrc.
      target: browserslistToEsbuild(undefined, { path: import.meta.dirname }),
    },
    plugins: [tailwindcss()],
  },
});
