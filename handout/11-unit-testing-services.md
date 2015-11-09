# Part 11: Unit Testing Services

## Testing Services

Our tests are not really "unit tests" if they make use of many layers of dependencies - and especially if they make server calls. So, we need to "mock" our dependencies.

Since our services are classes with all of their dependencies injected through their constructors, testing them is simple. We just need to mock out all of their dependencies and pass them to our service class.

Let's create some unit tests for our `TasksService` class, starting by mocking out it's only dependency, `ServerService`.

```javascript
import {TasksService} from './tasks-service';

describe('TasksService', () => {
  
  let _mockServerService;
  
  let _mockTasks = [{
    owner: 'alice',
    description: 'Build the dog shed.',
    done: true
  }, {
    owner: 'bob',
    description: 'Get the milk.',
    done: false
  }, {
    owner: 'alice',
    description: 'Fix the door handle.',
    done: true
  }];

  beforeEach(() => { 
    _mockServerService = {
      get: () => Promise.resolve(_mockTasks)
    };
  });

  it('should get loaded', function() {
    let tasksService = new TasksService(_mockServerService);
    chai.expect(tasksService.getTasks()).to.not.be.undefined;
  });
});

```

Let's save this to `app/src/services/tasks/tasks-service.test.js`.

The sad truth, though, is that we have only established that `tasksService.getTasks()` does return a promise. We can't really judge the success of this test until we know what that promise resolves to.

## An Asynchronous Test

So, we want to check what the promise resolves too, but this only will happen
*later*. So, we need to use an asynchronous test that would wait for the promise to resolve.

```javascript
  ...
  beforeEach(() => { 
    _mockServerService = {
      get: () => Promise.resolve(_mockTasks)
    };
  });

  it('should get loaded', function() {
    let tasksService = new TasksService(_mockServerService);
    chai.expect(tasksService.getTasks()).to.not.be.undefined;
  });
  
  it('should get tasks', (done) => {
    // Notice that we've specified that our function takes a 'done' argument.
    // This tells Mocha this is an asynchronous test. An asynchronous test will
    // not be considered 'successful' until done() is called without any
    // arguments. If we call done() with an argument the test fails, treating
    // that argument as an error.
    let tasksService = new TasksService(_mockServerService);
    
    return tasksService.getTasks()
      .then(tasks => {
        // Assertions thrown here will result to a failed promise downstream.
        expect(tasks).to.deep.equal(_mockTasks);
        done();
      })
      // Remember to call done(), otherwise the test will time out (and fail).
      .then(null, error => {
        done(error);
      });
  });
  ...
```

Note the use of `deep.equal` assertion to check that the tasks received by calling `TasksService.getTasks()` method. Let's run.

## A Simplified Use of done()

If all we want to do in case of error is to pass it to done, we don't
actually need to define a new function in the handler. We can just provide
`done` as the handler.

```javascript
  .then(null, error => done(error));
```

is equivalent to:

```javascript
  .then(null, done);
```

## Mocha's Support for Promises

Mocha's tests can alternatively just accept a promise. In most case this is
what you want to use.

```javascript
  ...
  it('should get tasks', () => {
    let tasksService = new TasksService(_mockServerService);
    return tasksService.getTasks()
      .then(tasks => chai.expect(tasks).to.deep.equal(_mockTasks));
  });
  ...
```

## Spying with Sinon

A test spy is a function that records arguments, return value, the value of
`this`, and exception thrown (if any) for all its calls. A test spy can be an
anonymous function or it can wrap an existing function. When using Sinon,
we'll wrap the existing function with `sinon.spy()`:

```javascript
  ...
  beforeEach(() => { 
    _mockServerService = {
      get: sinon.spy(() => Promise.resolve(_mockTasks))
    };
    _mockServerService.get.reset();
  });
  ...
```

When spying on existing functions, the original function will behave as
normal, but we will be proxied through the spy, which will collect information
about the calls. For example, we can check if the function has been called:

```javascript
  ...
  it('should only call server service get once', () => {
    let tasksService = new TasksService(_mockServerService);
    return tasksService.getTasks() // Call getTasks the first time.
      .then(() => tasksService.getTasks())
      .then(() => chai.expect(_mockServerService.get.calledOnce).to.be.true);
  });
  ...
```

Note that here we created a new test to verify that `serverService.get` is only
getting called once. In between each test we are resetting the data gathered by the spy with `_mockServerService.get.reset()`. 

Finally, we do not attempt to verify in this test that the promise returned by `getTasks()` actually resolves to the value we expect, since this is already being verified by another test. Keeping tests small and
focused greatly facilitates test maintenance.

## Refactor Hard-to-Test Code

As you start writing unit tests, you may find that a lot of your code is hard
to test. The best strategy is often to refactor your code so as to make it easy to test. For example, consider refactoring your component code into services and focusing on service tests.
