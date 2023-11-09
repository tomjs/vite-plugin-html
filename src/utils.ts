import _ from 'lodash';

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
