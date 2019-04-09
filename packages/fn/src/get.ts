
const LEADING_ARRAY = /\[/g;
const TRAILING_ARRAY = /^\[|\]/g;

const get = (obj: object, path: string, def: any) => {
  try {
    return path
      .replace(TRAILING_ARRAY, '')
      .replace(LEADING_ARRAY, '.')
      .split('.')
      .reduce((a: any, b: string) => a[b], obj) || def;
  } catch (e) {
    return def;
  }
}

module.exports = { get };