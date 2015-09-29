# Part 06: Introduction to Unit Testing

## The Rationale

Why bother with unit tests?

## Unit Tests vs Integration Tests

A **unit test** is used to test individual components of the system. An
**integration test** is a test which tests the system as a whole, and how it
will run in production.

Unit tests should only verify the behaviour of a specific unit of code. If
the unit's behaviour is modified, then the unit test would be updated as well.
Unit tests should not make assumptions about the behaviour of _other_ parts of
your codebase or your dependencies. When other parts of your codebase are
modified, your unit tests **should not fail**. (If they do fail, you have
written a test that relies on other components, it is therefore not a unit
test.) Unit tests are cheap to maintain, and should only be updated when the
individual units are modified.

## The Toolchain

Let's talk about some of the available tools. Our preferred toolchain consists
of:

* Mocha - the actual test framework.
* Chai - an assertion library.
* Sinon - a spy library.
* Karma - a test "runner".
* Gulp - a task automation tool.

## Why Mocha?

While we see this as the best combination of tools, a common alternative is Jasmine, a somewhat older tool that combines features of Mocha, Chai and Sinon.

Mocha provides better support for asynchronous testing by adding support for the `done()` function. If you use it, your test doesn't pass until the `done()`function is called. This is a nice to have when testing asynchronous code. Mocha also allows for use of any assertion library that throws exceptions on failure, such as Chai.

## A Basic Mocha Test

First, let's write a simple test and run it. Put this code into `source/ts/simple.test.js`.

```javascript
  describe('Simple Test', () => {
    it('2*2 should equal 4', () => {
      let x;
      // Do something.
      x = 2 * 2;
      // Check that the results are what we expect and throw an error if something is off.
      if (x!==4) {
        throw new Error('Failure of basic arithmetics.');
      }
    });
  });

```

## Running Mocha Tests with Karma and Gulp

We can now run this code from the command line using our gulp task (more in subsequent chapters):

```bash
  gulp karma
```

This will run **all** tests under client.

See *gulpfile.js* on how to implement the `karma` task code for more details. Karma configuration is in `karma.conf.js`.

## The Importance of Test Documentation

The first argument to `it()` should explain what your test aims to verify.
Beyond that, consider adding additional information through comments.
Well-documented tests can serve as documentation for your code and can simplify
maintenance.

## Mocha with Chai

Chai is an assertion library. It makes it easy to throw errors when things are
not as we expect them to be. Chai has two styles: "[TDD](http://en.wikipedia.org/wiki/Test-driven_development)" and "[BDD](http://en.wikipedia.org/wiki/Behavior-driven_development)". We'll be using the "[BDD](http://en.wikipedia.org/wiki/Behavior-driven_development)" style.

We have already installed Chai when we ran `npm install` and we are already
loading it when we run Karma via `gulp`. So, now we can go straight to using
it.

```javascript
  describe('Simple Test', () => {
    it('2*2 should equal 4', () => {
      let x = 2 * 2;
      let y = 4;
      // Assert that x is defined.
      chai.expect(x).to.not.be.undefined;
      // Assert that x equals to specific value.
      chai.expect(x).to.equal(4);
      // Assert that x equals to y.
      chai.expect(x).to.equal(y);
      // See http://chaijs.com/api/bdd/ for more assertion options.
    });
  });
```

## Unit Testing Simple Components

Let's see how we can apply what we learned so far and unit test our `TaskComponent`. Create a new file *source/ts/components/task/task-component.test.ts*, and copy the following unit-test code.

```javascript
import 'angular';
import 'angular-mocks';

import {makeDirective, makeSelector} from '../../utils/component-utils';
import {TaskComponent} from './task-component';
import '../../template-cache';

describe('TaskComponent', () => {

  let _$scope;
  let _$compile;

  angular.module('tasks', ['ngcourse.templates'])
    .directive(
      makeSelector(TaskComponent), 
      makeDirective(TaskComponent));
   
  beforeEach(() => { 
    angular.mock.module('tasks');
    angular.mock.inject(($compile, $rootScope) => {
      _$scope = $rootScope.$new();
      _$compile = $compile;
    });
  });

  it('generate the appropriate HTML', () => {
    _$scope.task = {
      owner: 'alice',
      description: 'Fix the door handle.',
      done: true
    };
    
    _$scope.user = {
      displayName: 'Alice'
    };
    
    let element = angular.element(
      `<ngc-task
        task="task" 
        user="user">
      </ngc-task>`);
      
    let compiled = _$compile(element)(_$scope);
  
    _$scope.$digest();
    
    chai.expect(compiled.html()).to.contain('Fix the door handle.');
  });
});
```

There's a lot going on here, so let's break it down a bit.

### Template Cache

First let's talk about `import '../../template-cache';`. The first time a template is used within AngularJS context, it is put into the template cache for quick retrieval on subsequent requests.  

In our application we are using a gulp plugin within our `template-cache` gulp task (which can be found in `gulfile.js`) to put all of our .html templates into the cache right away. Template cache is just a map, with a template URL as a key and the template as a value. Our gulp task puts our templates into the template cache map and wraps them into an angular module we named 'ngcourse.templates'.

So importing our template cache, and defining a mock tasks module with a 'ngcourse.templates' as it's dependency gives us access to our component's template within the test.

### Before Each 

This is simple, as the name implies, this block defines a set of operations to be run before each test defined using the `it` block.

### Inject

Also, we're using `inject()` to get access to two Angular services:

* $compile - used for evaluating the directive's template HTML.
* $rootScope - used to create an isolated $scope object for passing test data into the directive. Each time a new test is run (defined using it), a new isolated scope for our component will be created using `$rootScope.$new()`.

### The Test

In the test itself, we:

1. Put the mock task data to on the scope to be passed into our component in the next step.
2. Create the directive using its HTML form, the way it would be used in real code.
3. Tell Angular to evaluate the template HTML based on the $scope we constructed.
4. Manually trigger Angular's digest cycle, which causes any angular expressions (`{{ }}` blocks) in the directive's template HTML to be evaluated.
5. Verify that the expected markup was generated by the directive.
