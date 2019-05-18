const promisify = require('util').promisify ||
(fn => (...args) => new Promise((resolve, reject) => {
  fn(...args, (error, results) => {
    if (error) reject(error);
    else resolve(results);
  })
}));
const fs = require('fs');
const exec = promisify(require('child_process').exec);
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const assert = require('assert');

const code = `
const { Maybe } = require('monad-maniac');

const double = (x) => x * 2
const just = Maybe.of(10)
const nothing = Maybe.of(null)

if (just.map(double).toString() !== 'Just(20)') {
  throw new Error('Not Just(20)')
}
if (nothing.map(double).toString() !== 'Nothing()') {
  throw new Error('Not Nothing()')
}
`

Promise.resolve()
  .then(() => mkdir('smoke-test'))
  .then(() => process.chdir('smoke-test'))
  .then(() => exec('npm init -y'))
  .then(() => exec('npm install ../'))
  .then(() => writeFile('foo.js', code))
  .then(() => exec('node foo'))
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error', error);
    process.exit(1);
  });
