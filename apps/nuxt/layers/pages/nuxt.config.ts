import path from 'node:path';

function resolve(...filePath: string[]) {
  return path.resolve(__dirname, ...filePath);
}

export default defineNuxtConfig({
  $meta: {
    name: 'pages',
  },
  alias: {
    '~pages': resolve('app'),
  },
  components: [
    {
      extensions: ['.vue'],
      // Private helpers (`_components/`, `_Foo.vue`) stay local to their folder.
      ignore: ['**/_/**', '**/_*'],
      path: resolve('app/components'),
      pathPrefix: false,
    },
  ],
  imports: {
    dirs: [
      // Each page exposes its nav params, navigation and preload functions globally.
      resolve('app/components/*/{utils,composables,stores}/**'),
    ],
  },
});
