
const isPromise = (v: any) => 
  v.then && typeof v.then === 'function';

const pipe = (...fn: any[]) => 
  (initial: any) => fn.reduce((a, n) => 
    isPromise(n)
      ? n.then(a)
      : n(a), 
    initial);

module.exports = { pipe };