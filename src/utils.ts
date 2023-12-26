import { spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'fs-extra';
import _ from 'lodash';
import semver from 'semver';

/**
 * Check if the array is empty
 */
export function isEmptyArray(value: any) {
  return !Array.isArray(value) || value.length === 0;
}

/**
 * Convert string to PascalCase
 */
export function pascalCase(str: string) {
  return _.upperFirst(_.camelCase(str));
}

/**
 * Generate a 32-bit UUID
 */
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16).replace(/-/g, '');
  });
}

/**
 * url concat
 */
export function urlConcat(...urls: string[]) {
  return urls
    .map(s => (s || '').trim())
    .filter(s => s)
    .join('/')
    .replace(/\/+/g, '/')
    .replace(/:\//, '://');
}

export function getPkgPath(pkgName: string) {
  const pwd = process.cwd();
  const pkgPath = path.join(pwd, 'node_modules', pkgName);
  if (fs.existsSync(pkgPath)) {
    return pkgPath;
  }
}

export function getNpmDeps() {
  const flatDeps: Record<string, { version: string; path: string }> = {};

  try {
    const res = spawnSync(
      process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
      ['list', '--prod', '--depth=1', '--json'],
      {
        // stdio: ['inherit', 'ignore'],
        cwd: process.cwd(),
        encoding: 'utf-8',
      },
    );

    if (res.status === 0 && res.stdout) {
      const list = JSON.parse(res.stdout.trim());
      if (list.length === 0) {
        return flatDeps;
      }

      const handleFlatDeps = deps => {
        Object.keys(deps).forEach(name => {
          const { version, path, dependencies } = deps[name];
          if (!flatDeps[name] || semver.gt(version, flatDeps[name].version)) {
            flatDeps[name] = {
              version,
              path,
            };
          }

          if (dependencies) {
            handleFlatDeps(dependencies);
          }
        });
      };

      handleFlatDeps(list[0].dependencies || {});

      return flatDeps;
    }
  } catch {}

  return flatDeps;
}
