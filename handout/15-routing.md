# Part 15: UI Router

Routing allows us to express some aspects of the app's state in the URL.
Unlike with server-side front-end solutions, this is optional - we can build
the full app without ever changing the URL. Adding routing, however, allows
the user to go straight into certain aspects of the app, which can be very
convenient.

## UI-Router

Angular's built in routing solution ('ng-route') has been de facto superseded
by [ui-router](https://github.com/angular-ui/ui-router/blob/master/README.md). We'll be using that. To use UI-Router you'll need to update your `source/ts/app.ts` to inject the new module into your main module:

```javascript
  angular.module('ngcourse', [
    'ngcourse.tasks',
    'ngcourse.server',
    'ngcourse.router'
  ])
```

## Creating a Router Service.

Let's start by adding our own "router" module which will serve as a wrapper
around ui-router. Our module will have a `.config()` section.

This goes in `source/ts/services/router/router-service.js`

```javascript
import {Inject} from '../../utils/di';

export class RouterConfig {

  constructor(
    @Inject('$stateProvider') private $stateProvider,
    @Inject('$urlRouterProvider') private $urlRouterProvider,
    @Inject('$locationProvider') private $locationProvider
  ) {

    $urlRouterProvider.otherwise('/tasks');
    $locationProvider.html5Mode(false);

    $stateProvider
      .state('tasks', {
        url: '/tasks',
        views: {
          '': {
            template: 'my tasks'
          }
        }
      });
  }
}
```

Let's configure the router within our *app.ts* file as follows:

```javascript
angular.module('ngcourse.router', ['ui.router'])
  .config(RouterConfig);
```

We'll also need to add a directive for ui-router in index.html:

```html
  <div ui-view></div>
```

Your index.html main section should now look like this:

```html
  ...
  <ngc-main>
    <div ui-view></main>
  </ngc-main>
  ...
```

`ui-view` is a directive that `ui-router` uses to manage its views. It will be replaced by the template or templateURL that is configured for each ui-router state.

`ui-router` will insert the content in the `ui-view` element based on the current application state defined in `$stateProvider` above.

Let's talk about why this need to happen in the "config" section.

## .config() and Providers

Up until now, we've mostly been dealing with services and controllers.
However the example above introduces a couple of new concepts: providers and
`.config()` blocks.

When an AngularJS application starts up, it goes through several 'phases':

0. Angular executes your code that contains calls to methods such as
  `.service()`, `.constant()`, `.config()`, etc. However, at this point all of
  those entities are only defined. They are not yet instantiated. In other
  words, Angular takes note of the fact that will want to create a service
  'tasks' using the provided function. It does _not_ however, call this
  function at this point.

1. Constants defined in `.constant()` blocks are set.

2. Registered providers are created. The order is determined by dependencies
  between providers.

3. All `.config()` blocks are executed in order in which they were defined.
  The code in config blocks can refer to constants and can call methods on
  providers.

4. Values are set.

5. Services are instantiated. This includes services defined by `.factory()`
  and `.service()`, as well as those defined via providers. The order depends
  on the dependencies between the services.

6. All .run() blocks are executed in the order in which they were defined.

A provider is something Angular's dependency injector can use to create a
service. The provider can be configured with various data in the app's
`config` phase, _before any services are instantiated_. When services are
instantiated later, they can customize them based on configuration requests it
received in the config phase.

In practical terms, any JavaScript object that exposes a function called $get()
can serve as a provider.  We'll cover this in more detail in part 15 of this
course.

So in this example, we're configuring ui-router's `$stateProvider`,
`$urlRouterProvider`, and `$locationProvider` with settings that will later
be used to generate state, route, and location services with the correct path
and parameter data for use in our own controllers.

## More States

```javascript
  $stateProvider
    .state('tasks', {
      url: '/tasks',
      template: 'my tasks'
    })
    .state('tasksDetail', {
      url: '/tasks/details',
      template: 'task details'
    })
    .state('account', {
      url: '/my-account',
      template: 'my account'
    });
```

## States with Parameters

```javascript
  .state('tasksDetailById', {
    url: '/tasks/{_id}',
    template: 'task details with id'
  })
```

This can include regular expressions:

```javascript
  .state('tasksDetailByRegex', {
    url: '/tasks/{_id:[A-Za-z0-9-_]{0,}}',
    template: 'task details with regex'
  })
```

Now we are going to rebuild our view around ui-router. First, let's do tasks.

## Components and Routing

The rule of thumb when using routing is that routes should be defined for top-level components. Generally, micro components should not be used in routing but instead used within the templates of macro component who pass data into them from above.

So in our case, `TaskListComponent` is a good candidate while `TaskComponent` is not.

There are 2 ways we can add a component as a routing state:

The inline template way

```javascript
  .state('tasks', {
    url: '/tasks',
    views: {
      '': {
        template: '<ngc-tasks></ngc-tasks>'
      }
    }
  })
  ...
```

or the "controller" way

```javascript
  import {TaskListComponent} from 'components/task-list/task-list-component';
  ...

  .state('tasks', {
    url: '/tasks',
    views: {
      '': {
        controller: TaskListComponent,
        controllerAs: 'ctrl',
        templateUrl: TaskListComponent.templateUrl
      }
    }
  })
  ...
```

Both are equivalent, but with the former approach there is no need to define this component on a module using `.directive()`

Let's take a moment to review a few other aspects of ui-router.

## Adding "Resolves"

We'll add a resolve: parameter to our state to demonstrate the user of resolves. Note that resolves isn't used to often and we'll remove this once we've learned the functionality.

```javascript
  .state('account', {
      url: '/my-account',
      template: 'My account',
      resolve: {
        greeting: function($timeout) {
          return $timeout(function() {
            return 'Hello';
          }, 3000);
        }
      }
    });
```

The "resolve" property in a state configuration allows us to specify a set of
dependencies that will need to resolved prior to transitioning to the new
state. Those dependencies become injectable in the route's controller. In the
example above, `greeting` property of the resolve is set to a function that
returns a promise that resolves to 'Hello' after 3000 msec. (We generate this
property using `$timeout`.) The UI-Router will wait until the promise
resolves, then make the transition. The state's controller will be able to
dependency-inject 'greeting', which will be set to 'Hello' by the time the
controller is initialized.

This approach can simplify controller code, but does so at the cost of
terrible user experience: after the user clicks on a button, nothing happens
for 3 seconds, leaving the user wondering what happened.

A better approach is to not rely on "resolve" and instead make the transition
immediately. The receiving controller can then decide what parts of the view
can be displayed right away and what parts will need to be displayed with a
short delay. For example, if the state involves displaying a list of objects
that need to be retrieved from the server, the app can display everything
other than the list, then make add the list items when they arrive. This
usually produces a more natural experience for the user.

## Nesting Views

One of the most powerful features of ui-router versus the out-of-the-box AngularJS router is nested views. To allow `ui-router` to know what view it's updating, we can add a name to the view as seen in `ui-view="child@parent"` below.

```javascript
  .state('parent', {
    url: '/parent',
    views: {
      'parent': {
        template: 'parent view <div ui-view="child@parent"></div>'
      }
    },
  })
  .state('parent.child1', {
    url: '/child1',
    views: {
      'child@parent': {
        template: 'child 1'
      }
    }
  })
  .state('parent.child2', {
    url: '/child2',
    views: {
      'child@parent': {
        template: 'child 2'
      }
    }
  });
```

Update the parent index.html to be named using `<div ui-view="parent"/>`.

Nesting views allows sophisticated routing where parts of the view are defined
by the parent state and parts are defined (or, overridden) by child states.
Note that states get nested implicitly, based on names: "parent.child1" will be
a child of "parent". (UI-Router also provides a facility for nesting states
explicitly.) Child state's URL is understood to be relative to the parents.
So, since "parent.child1" is a child of "parent" and parent's URL is "/parent",
the URL for "child1" is "/parent/child1".

In the example above, the parent view provides part of the view (the text
"parent view") and a placeholder where child states would go. When we visit
child1 and child2, the parent's part of the view remains unchanged, while the
child's section changes.

Alternatively, however, the child can override the parent's part of the view:

```javascript
  .state('parent.child2.grandchild', {
    url: '/grandchild',
    views: {
      'child@parent': {
        template: 'parent overriden'
      }
    }
  })
```

In this case the "grandchild" overrides the view earlier defined by child2.

When overriding parents views we need to refer to them using the ..@.. which allows us to specify an absolute path to the view.

## Transition Using `ui-sref`

We can easily transition between states using `ui-sref` directive:

```html
  <button ui-sref="tasks">Go to tasks</button>
```

## Transitions Using `$state.go()`.

We can also transition using `$state.go()`:

```javascript
  $state.go('tasks.details', {_id: taskId});
```

However, let's wrap this in a service, we can use the same *router-service.ts* file for convinience:

```javascript
  ...
  export class RouterService {

    constructor(@Inject('$state') private $state) { }

    goToTask(taskId) {
      this.$state.go('tasks.details', {
        _id: taskId
      });
    }

    goToTaskList() {
      this.$state.go('tasks', {}, {
        reload: true
      });
    }
  };

```

## Accessing Parameters Using `$stateParams`

`$stateParams` can be injected into your components using the `@Inject` and used as follows:

```javascript
  $stateParams._id
```

But again, let's wrap it:

```javascript
  ...
  getTaskId() {
    return this.$stateParams._id;
  };
```

## Update Param Without a Reload

If we want to change the value of the parameters _without_ triggering a state
transition, we need to update the values in thre three different places where
the UI route keeps them.

```javascript
  // Updates a state param without triggering a reload.
  function quietlyUpdateParam(key, value) {
    $state.params[key] = value;
    $stateParams[key] = value;
    $state.$current.params[key] = value;
  }
```

An example of where this would be useful is a Google Maps style UI, where the
URL is continuously updated as the user moves around the map.
