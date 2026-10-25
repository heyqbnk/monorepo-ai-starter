import path from 'node:path';

function resolve(...filePath: string[]) {
  return path.resolve(__dirname, ...filePath);
}

export default defineNuxtConfig({
  $meta: {
    name: 'ui-kit',
  },
  components: [
    {
      path: resolve('app/components'),
      pathPrefix: false,
      // Private helpers (`_components/`, `_Foo.vue`) stay local to their folder.
      ignore: ['**/_/**', '**/_*'],
    },
  ],
  alias: {
    '~ui-kit': resolve('app'),
  },
});
