import _ from 'lodash';

/**
 * 是否为空数组
 */
export function isEmptyArray(value: any) {
  return !Array.isArray(value) || value.length === 0;
}

/**
 * 转换为大驼峰
 */
export function pascalCase(str: string) {
  return _.upperFirst(_.camelCase(str));
}

/**
 * 32位uuid
 */
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16).replace(/-/g, '');
  });
}

/**
 * url 地址拼接
 */
export function urlContact(...urls: string[]) {
  return urls
    .map(s => (s || '').trim())
    .filter(s => s)
    .join('/')
    .replace(/\/+/g, '/')
    .replace(/:\//, '://');
}
