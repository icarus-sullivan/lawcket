
const toss = (msg: string) => {
  throw new Error(msg);
}

module.exports = { toss };