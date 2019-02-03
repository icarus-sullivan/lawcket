

const pipe = (...fn) => (initialValue) => fn.reduce((curr, next) => 
curr && curr.then && typeof curr.then === 'function'
    ? curr.then(next)
    : next(curr), initialValue);

const curry = (fn) => (...args) => fn.bind(fn, ...args);

module.exports = {
  pipe,
  curry,
}