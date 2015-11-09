# Part 8: Introduction to Promises.

In Part 7 we saw that `$http` methods give us promises. But what exactly is a
promise?

## Promises vs Callbacks

JavaScript is single threaded, so we can't really ever "wait" for a result of
a task such as an HTTP request. Our baseline solution is callbacks:

```javascript
  request(url, (error, response) => {
    // handle success or error.
  });
  doSomethingElse();
```

A few problems with that. One is the "Pyramid of Doom":

```javascript
  queryTheDatabase(query, (error, result) => {
    request(url, (error, response) => {
      doSomethingElse(response, (error, result) => {
        doAnotherThing(result, (error, result) => {
          request(anotherUrl, (error, response) => {
            ...
          })
        });
      })
    });
  });
```

And this is without any error handling! A larger problem, though: hard to decompose.

The essence of the problem is that this pattern requires us to specify the
task and the callback at the same time. In contrast, promises allow us to
specify and dispatch the request in one place:

```javascript
  promise = $http.get(url);
```
and then to add the callback later, and in a different place:

```javascript
  promise.then(response => {
    // handle the response.
  });
```

This also allows us to attach multiple handlers to the same task:

```javascript
  promise.then(response => {
    // handle the response.
  });
  promise.then(response => {
    // do something else with the response.
  });
```

## Unchaining Promises

You might have seen chained promises:

```javascript
  $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
    .then(response => response.data)
    .then(tasks => {
      $log.info(tasks);
      vm.tasks = tasks;
    })
    .then(null, error => $log.error(error));
```

We could also make this more complicated:

```javascript
  $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
    .then(response => {
      let tasks = response.data;
      return filterTasks(tasks);
    })
    .then(tasks => {
      $log.info(tasks);
      vm.tasks = tasks;
    })
    .then(null, error => $log.error(error);
```

Or even:

```javascript
  $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
    .then(response => response.data)
    .then(tasks => filterTasksAsynchronously(tasks))
    .then(tasks => {
      $log.info(tasks);
      vm.tasks = tasks;
    })
    .then(null, error => $log.error(error));
```

To make sense, let's "unchain" this using variables:

```javascript
  let responsePromise = $http.get('http://ngcourse.herokuapp.com/api/v1/tasks');
  let tasksPromise = responsePromise.then(
    response => response.data);

  let filteredTasksPromise = tasksPromise.then(
    tasks => filterTasksAsynchronously(tasks));

  let vmUpdatePromise = filteredTasksPromise.then(tasks => {
    $log.info(tasks);
    vm.tasks = tasks;
  })

  let errorHandlerPromise = vmUpdatePromise.then(
    null, error => $log.error(error));
```

Let's work through this example.

## Promises Beget Promises (via `.then()`)

A key point to remember: unless your promise library is buggy, `.then()`
always returns a promise. Always.

```javascript
  p1 = getDataAsync(query);

  p2 = p1.then(
    results => transformData(results));
```

`p2` is now a promise regardless of what transformData() returned. Even if
something fails.

If the callback function returns a value, the promise resolves to that value:

```javascript
  p2 = p1.then(results => 1);
```

`p2` will resolve to “1”.

If the callback function returns a promise, the promise resolves to a
functionally equivalent promise:

```javascript
  p2 = p1.then(results => {
    let newPromise = getSomePromise();
    return newPromise;
  });
```

`p2` is now functionally equivalent to newPromise. It's not the same object,
however. Let's discuss why not.

```javascript
  p2 = p1.then(
    results => throw Error('Oops'));

  p2.then(results => {
    // You will be wondering why this is never
    // called.
  });
```

`p2` is still a promise, but now it will be rejected with the thrown error.

Why won't the second callback ever be called?

## Catching Rejections

So, catch rejections:

```javascript
  $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
    .then(response => response.data)
    .then(tasks => filterTasksAsynchronously(tasks))
    .then(
      tasks => {
        $log.info(tasks);
        vm.tasks = tasks;
      }, 
      error => $log.error(error));
```

What's the problem with this code?

So, the following is better.

```javascript
  $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
    .then(response => response.data)
    .then(tasks => filterTasksAsynchronously(tasks))
    .then(tasks => {
      $log.info(tasks);
      vm.tasks = tasks;
    })
    .then(
      null, 
      error => log.error(error)
    );
```

Note that one catch at the end is often enough.

## Using an Existing Function As a Handler

```javascript
    .then(null, error => $log.error(error));
```

can be replaced with:

```javascript
    .then(null, $log.error);
```

Let's make sure we understand why.

## Returning Promises

There is one (common) case when it's ok to not catch the rejection:

```javascript
  return $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
    .then(response => response.data);
```

That's passing the buck. But remember: the buck stops with the component's
function that is triggered by Angular.

## Catch and Release

Or you can catch, do something, and still pass the exception onwards:

```javascript
  .then(null, error => {
    $log.error(error); // Log the error
    throw error; // Then re-throw it.
  });
```

Sometimes we may want to re-throw conditionally.

## Promise Chains Considered Harmful

A better approach is to break them up into meaningful functions.

```javascript
  function getTasks() {
    return $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
      .then(response => response.data);
  }

  function getMyTasks() {
    return getTasks()
      .then(tasks => filterTasks(tasks, {owner: user.username}));
  }

  getMyTasks()
    .then(tasks => {
      $log.info(tasks);
      vm.tasks = tasks;
    })
    .then(null, $log.error);
```
