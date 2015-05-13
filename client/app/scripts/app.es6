import ticker from './ticker.es6'
console.log('Hello');

ticker.getAll().then(
  function (success) {
    console.log(success);
  },
  function (error) {
    console.error(error);
});