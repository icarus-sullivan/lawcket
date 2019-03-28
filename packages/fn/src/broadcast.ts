
const broadcast = (...fn: any[]) => 
  (...args: any[]) => Promise.all(fn.map(fn => fn(...args)));

module.exports = {
  broadcast,
};