import repo from './repository.es6'
console.log('Hello');

repo.configure({
  rootUrl: 'http://localhost:9001'
});

repo.getAll().then(
  function (success) {
    console.log(success);
  },
  function (error) {
    console.error(error);
});