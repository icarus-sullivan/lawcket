
const curry = (fn: Function) => 
  (...args: any) => fn.bind(null, ...args);

module.exports = { curry };