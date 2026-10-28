import path from 'node:path';

function resolve(...filePath: string[]) {
  return path.resolve(__dirname, ...filePath);
}

export default defineNuxtConfig({
  $meta: {
    name: 'ui-kit',
  },
  alias: {
    '~ui-kit': resolve('app'),
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
  css: [resolve('app/assets/css/colors.css')],
});
