import { createHash } from 'node:crypto';
import path from 'node:path';

const HASH_ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export interface CreateCssModuleScopedNameOptions {
  /**
   * Directory file paths are made relative to before hashing, usually the app's root.
   */
  rootDir: string;
  /**
   * Whether the class name carries the component name, for readability in development.
   */
  withComponentName: boolean;
}

/**
 * Creates a CSS modules `generateScopedName`. With `withComponentName` the class name carries
 * the component name (`HeroSection__root_abcde`), otherwise it is only a short hash
 * (`abcde`).
 *
 * The hash is derived from the file path relative to `rootDir` and the class name rather
 * than from a counter, so class names stay stable across builds, and match between the
 * server and client bundles, which are built separately.
 */
export function createCssModuleScopedName({
  rootDir,
  withComponentName,
}: CreateCssModuleScopedNameOptions) {
  return (className: string, filename: string): string => {
    // Vue appends a query to SFC style blocks, e.g. `Foo.vue?vue&type=style&index=0&lang.module.css`.
    const filePath = filename.split('?')[0]!;
    // Letters only, so the result is always a valid class name and never starts with a digit.
    const hash = Array
      .from(
        createHash('md5').update(`${path.relative(rootDir, filePath)}:${className}`).digest().subarray(0, 5),
        byte => HASH_ALPHABET[byte % HASH_ALPHABET.length],
      )
      .join('');

    if (!withComponentName) {
      return hash;
    }
    const componentName = path.basename(filePath).replace(/(\.module)?\.(vue|s?css)$/, '');
    return `${componentName}__${className}_${hash}`;
  };
}
