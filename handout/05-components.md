# Part 5: Getting Started with the Client

This course will be organized around building a collaborative task manager. We will start by building a client app, which we will later connect to a REST API. Our first task is to setup a simple Angular app consisting of a few **components**, and to understand how they fit together. 

We'll be making use of common built-in directives such as `ng-model`, `ng-show`, `ng-hide`, `ng-cloak`, `ng-if`, `ng-repeat`. We will also discuss Angular’s dependency injection and the use of `$log` for logging.

## The Most Trivial Angular App

Let's start by setting up a really simple angular app -- so simple in fact that it won't do anything at all. Here is what we'll put in our *index.html* file.

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="/bower_components/es6-module-loader/dist/es6-module-loader.js"></script>
    <script src="/bower_components/system.js/dist/system.js"></script>
  </head>
  <body>
    <div>Hello World!</div>
    <script src="/app/loader.config.js"></script>
    <script>
      System.import('app');
    </script>
  </body>
</html>
```

We'll also need a very simple TypeScript file - our "app":

```javascript
angular.module('ngcourse', []);

angular.element(document).ready(function() {
  angular.bootstrap(document, ['ngcourse']);
});
```

# Angular 1.x Basics

This app doesn't do anything at all. To make it do something remotely interesting we'll need to define a directive. 

## Directives

In Angular 1.x, directives are the building blocks of your application. Directives can be described as markers on the DOM tree that allow to define custom behaviour and/or transformations on that DOM element.

Let's define a basic directive in our *app.ts* file to see this in action,

```javascript
...
angular.module('ngcourse')
  .directive('ngcMain', () => {
    return {
      restrict: 'E', // vs 'A', 'AE'
      replace: true,
      scope: {}, // vs 'true', 'null'
      template: '<span>Hello World from Directive!</span>'
    };
  });
...
```

Note the way `angular.module()` is invoked in these two files. Let's make sure we understand the difference.

We already saw code that is similar, so we recognize JavaScript's "fluent" chaining style and the use of a function expression in the second argument to `directive()`.

And now we can use our directive in our *index.html* as follows:

```html
...
  <body>
    <ngc-main></ngc-main>
    ...
  </body>
```

Note that we used "camelCase" when we defined this directive in our Angular application, but we used hyphens when inserting them into the HTML.

Angular will figure out that `<ngc-main></ngc-main>` refers to the directive that we defined as `ngcMain`.

## Transclusion with `ng-transclude`

The way we defined our `ngc-main` directive above will ignore anything between the directive tags, as illustrated by example below.

```html
<ngc-main>This text will be thrown away.</ngc-main>
```

In some situation we would like the content to be preserved and shown on the DOM. To achieve this we will need to modify the transclude property of our directive like so:

```javascript
...
  .directive('ngcMain', () => {
    return {
      ...
      transclude: true,
      template: '<span>Hello World from Directive! <div ng-transclude/></span>'
    };
  });
...  
```

## Controllers

Our application still does not do very much. In order to add behaviour to our directive, lets define a controller class with some simple logic.

```javascript
class MainDirectiveCtrl {
  private userDisplayName;
  constructor() {
    this.userDisplayName = 'Mike Tyson';
  }
}

angular.module('ngcourse')
  .directive('ngcMain', () => {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      template: '<span>Hello, {{ ctrl.userDisplayName }}.</span>',
      controller: MainDirectiveCtrl,
      controllerAs: 'ctrl',
      bindToController: true
    };
  });
```

Note Angular's `{{ }}` syntax, refered to as the double mustache, used here
to bind controller's property to the template.

Let's recap:

### Template
The template is just an HTML snippet defining a view that represent this directive. Templates have access to any properties or functions defined on the directive's controller scope.

### Controller
The controller is just an ES6 class that backs component's view represented by a template. The template above binds the `userDisplayName` property defined on the `MainDirectiveCtrl` controller class using the double-mustache syntax `{{ ctrl.userDisplayName }}`.

## Using an External Template

Our templates are usualy too complex to include as a string. So, instead we often provide a URL to the template file by using `templateUrl` instead of the `template` option in our Directive Definition Object (DDO).

Let's create a new directory *client/app/components/main/* and extract our template into a html file called *main-component.html*. Our templateUrl option should now point to */dist/components/main/main-component.html*.

## Using an External Controller Class

In the same fashion we should extract our controller class into a separate file, as we want to avoid clutter when our application grows.

Create a file called *main-component.ts* in the */dist/components/main/main-component.html* and move our controller class definition there.

### Import and Export

Moving the controller class into a separate file is not enough as we need to reference it within our main *app.ts* file. That is what the ES6 import/export syntax is useful for.

Change the controller class definition in the *main-component.ts* file to include the export keyword as follows:

```javascript
export class MainDirectiveCtrl {
  private userDisplayName;
  constructor() {
    this.userDisplayName = 'Mike Tyson';
  }
}
```

Now in *app.ts* lets import our class as follows:

```javascript
import {MainDirectiveCtrl} from 'components/main/main-component';
...
angular.module('ngcourse', []);

angular.module('ngcourse')
  .directive('ngcMain', () => {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: '/dist/components/main/main-component.html',
      controller: MainDirectiveCtrl,
      controllerAs: 'ctrl',
      bindToController: true
    };
  });

angular.element(document).ready(function() {
  angular.bootstrap(document, ['ngcourse']);
});
...
```

With Angular 1.x basics out of the way we can start talking about...

# Components

As directive in Angular 1.x, in Angular 2, components are the building blocks of your application. As a matter of fact what we built in the previous section is refered to as **Component Directive** within Angular 1.x context. 

Angular 2's components are conceptually similar to component directives from Angular 1.x. The structure of Angular 2 application can be viewed as the tree of components, with a root element of that tree being the entry point of your application.

In summary, component is an object that structures and represents a UI element. It consists of two parts, component **controller** in charge of view logic and component **template** representing the view.

With that in mind let's define a basic component in a separate typescript file 
in *components/main/main-component.ts*:

```javascript
export class MainComponent {

  private static selector = 'ngc-main';
  private static templateUrl = '/dist/components/main/main-component.html';
  private static options = {};

  private username;
  private numberOfTasks;

  constructor() {
    this.username = 'alice';
    this.numberOfTasks = 0;
  }
}
```


## Using Components in your Angular 1.x Application

As a result of important similarities between components in Angular 2 and component directives from Angular 1.x, we can write Angular 2 style components today and future proof our applications.

In the previous section we learned how to define a component, now we need to use this component within our Angular 1.x application context. Components in Angular 2 share many of important similarities with component directives from Angular 1.x, and as a result it only makes sense to use `.directive()` function to instantiate them today. 

Lets change our *app.ts* and let Angular know about our component via the `.directive()` function.

```javascript
...
import {makeDirective, makeSelector} from 'utils/component-utils';
...
angular.module('ngcourse')
  .directive(
    makeSelector(MainComponent),
    makeDirective(MainComponent));
});
```

Note, the use of the utility functions we have created in *component-utils.ts*, allowing for a cleaner syntax when defining components. Let's look at the implementation of the function `makeSelector` and `makeDirective`.

Finally, we can now use this component in our *index.html* as follows:

```html
  <body>
    <ngc-main></ngc-main>
    ...
  </body>
```

## Handling Events with Components

If we put functions onto the component's scope, we can attach those functions to DOM events.

Let's add a `addTask()` method to our `MainComponent` class:

```typescript
  ...
  export class MainComponent {
    ...
    public addTask() {
      this.numberOfTasks += 1;
    }
  };
  ...
```

We need to modify our component's template and add a button element with an `addTask()` function attached to it's click event:

```html
  <div>
    <span>
      Hello, {{ ctrl.username }}!
      You've got {{ ctrl.numberOfTasks }} tasks.
      <button ng-click="ctrl.addTask()">Add task</button>
    </span>
  </div>
```

Note the use of `ng-click` directive here.

## A Look at Dependency Injection (DI)

Dependency Injection (DI) is a design pattern that allows software components to get references to their dependencies. DI allows to structure software in a way where components are decoupled from each other. This results in modular software structure with independent components which are much more unit-test friendly.

### Injecting Dependencies into Components

Let's start with injecting Angular's `$log` service into our component:

```javascript
  ...
  export class MainComponent {
    ...
    constructor( private $log ) { 
      ...
    }

    public addTask() {
      this.$log.debug('Current number of tasks:', this.numberOfTasks);
      this.numberOfTasks += 1;
    }
  };
  MainComponent.$inject = ['$log'];
  ...
```

In the code above we are injecting a `$log` service into our component by adding `$inject` static property to our component class. The reference to `$log` is available in the constructor. 

Note that a `private $log` parameter in the constructor automatically creates a property of the same name on the class scope, accessible using `this.$log`.

### Injecting Multiple Dependencies

This:

```javascript
  ...
  export class MainComponent {
    ...
    constructor(private $log, private $scope) { 
    ...
  };
  MainComponent.$inject = ['$log', '$scope'];
  ...
```

is equivalent to this (Don't do this!):

```javascript
  ...
  export class MainComponent {
    ...
    constructor(private $a, private $b) { 
    ...
  };
  MainComponent.$inject = ['$log', '$scope'];
  ...
```

But this:

```javascript
  ...
  export class MainComponent {
    ...
    constructor(private $scope, private $log) { 
    ...
  };
  MainComponent.$inject = ['$log', '$scope'];
  ...
```

Will not work at all. 

In short, the order of parameters in the `$inject` property relative to the class constructor is important.

### Utility Method for Dependency Injection

To simplify DI within our code we can use a utility function provided in *utils/di.ts* file as follows:

```javascript
  import {Inject} from 'utils/di';

  export class MainComponent {

    constructor(@Inject('$log') private $log) { 
      ...
    }

    public addTask() {
      this.$log.debug('Current number of tasks:', this.numberOfTasks);
      this.numberOfTasks += 1;
    }
  };
  ...
```

## Two-Way Data Binding with `ng-model`

We can also control our component's property value from within the HTML.
Modify the template of of our component to include the following:

```html
  <div>
    Enter username: <input ng-model="ctrl.username"/>
    <br/>
    <span>
      Hello, {{ ctrl.username }}!
      You've got {{ ctrl.numberOfTasks }} tasks.
      <button ng-click="ctrl.addTask()">Add task</button>
    </span>
  </div>
```

In the above example, the `ng-model` directive bi-directionaly binds an element to our component's class property. Note that if the property does not exist on the controller, it will be created.

**Important Note:** Two way binding in Angular 2 is one of the biggest changes compared to Angular 1.x. Angular 2 provides a mechanism allowing us to achieve 2-way data binding similarly to today, however this is mostly syntactic sugar while the underlying framework is different. A more detailed look into this will be provided in one of subsequent chapter of this course.

## Implementing "Login"

Let's modify our component's template to hide the login form upon login and show the task counter.

```html
  <div>
    <div ng-hide="ctrl.isAuthenticated">
      Enter username: <input ng-model="ctrl.username"/><br/>
      Password: <input type="password" ng-model="ctrl.password"/><br/>
      <button ng-click="ctrl.login()">Login</button>
    </div>
    <div ng-show="ctrl.isAuthenticated">
      Hello, {{ ctrl.username }}!
      You've got {{ ctrl.numberOfTasks }} tasks<br/>
      <button ng-click="ctrl.addTask()">Add task</button>
    </div>
  </div>
```

Note the use of `ng-hide` and `ng-show` directives here.

We'll also need to modify our component's controller as follows:

```javascript
  export class MainComponent {
    ...
    private isAuthenticated: any;
    private numberOfTasks: any;
    ...
    constructor( @Inject('$log') private $log ) { 
      this.numberOfTasks = 0;
      this.isAuthenticated = false;
    }

    public login() {
      this.isAuthenticated = true;
    }

    public addTask() {
      this.$log.debug('Current number of tasks:', this.numberOfTasks);
      this.numberOfTasks += 1;
    }

  };
```

## Splitting Up the Components

By this point our component is getting unweildy. Let's split it into two separate components. 

The first component will be located in *components/task-list/task-list-component.ts* and will implement our simple task counter.

```javascript
  import {Inject} from 'utils/di';

  export class TaskListComponent {
    private numberOfTasks;
    private static selector = 'ngc-tasks';
    private static templateUrl = '/dist/components/task-list/task-list-component.html';
    
    constructor( @Inject('$log') private $log ) {
      this.numberOfTasks = 0;
    }

    public addTask() {
      this.$log.debug('Current number of tasks:', this.numberOfTasks);
      this.numberOfTasks += 1;
    }

  };
```

We should also create a template file for this component with the familiar markup:

```html
<div>
  <span>
    Hello, {{ ctrl.username }}!
    You've got {{ ctrl.numberOfTasks }} tasks.
  </span>
  <button ng-click="ctrl.addTask()">Add task</button>
</div>
```

The second component will be remain at *components/main/main-component.ts* and will be responsible for user authentication. 

```javascript
  import {Inject} from 'utils/di';

  export class MainComponent {
    private static selector = 'ngc-main';
    private static templateUrl = '/dist/components/main/main-component.html';
    private isAuthenticated;

    constructor( @Inject('$log') private $log ) { 
      this.isAuthenticated = false;
    }

    public login() {
      this.isAuthenticated = true;
    }

  };

```

```html
  <div>
    <div ng-hide="ctrl.isAuthenticated">
      Enter username: <input ng-model="ctrl.username"/><br/>
      Password: <input type="password" ng-model="ctrl.password"/><br/>
      <button ng-click="ctrl.login()">Login</button>
    </div>
    <div ng-show="ctrl.isAuthenticated">
      <ngc-tasks></ngc-tasks>
    </div>
  </div>
```

The last thing remaining is to wire up our components within Angular application context.

```javascript
  ...
  import {MainComponent} from 'components/main/main-component';
  import {TaskListComponent} from 'components/task-list/task-list-component';
  ...
  angular.module('ngcourse')
    .directive(
      makeSelector(MainComponent), 
      makeDirective(MainComponent))
    .directive(
      makeSelector(TaskListComponent), 
      makeDirective(TaskListComponent));

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['ngcourse']);
  });
```

## Application Structure with Components

A useuful way of conceptualizing Angular application design is to look at it as a tree of nested components each having an isolated scope. 

Let's try adding another `<ngc-tasks></ngc-tasks>` element to the template of a component we defined in *components/main/main-component.ts* and observe what happens in the browser.

### Passing Data Between Components

We have introduced a bug during our re-factoring, the username is not displayed when  `TaskListComponent` is shown. Let's modify *task-list-component.ts* and fix it:

```javascript
  ...
  export class TaskListComponent {
    
    private static selector = 'ngc-tasks';
    private static templateUrl = '/dist/components/task-list/task-list-component.html';
    private static options = {
      bindToController: {
        username: '=username'
      }
    };
    ...
  }
```

and in *main-component.ts* let's change our template as follows:

```html
  ...
  <ngc-tasks username="ctrl.username"></ngc-tasks>
  ...
```

Now the `username` property is passed from `MainComponent` to `TaskListComponent` and this is how we can pass data "into" a child component.

### Responding to Component Events

Let's restructure our code further and create a new component to handle the login form for us. We will put this component in a new file *components/login-form/login-form-component.ts* and create an html template file for it as well.

```javascript
  import {Inject} from 'utils/di';

  export class LoginFormComponent {

    private static selector = 'ngc-login-form';
    private static templateUrl = '/dist/components/login-form/login-form-component.html';
    private static options = {
      bindToController: {
        fireSubmit: '&onSubmit'
      }
    };

    private username;
    private password;
    private fireSubmit: Function;

    constructor() {
      //
    }

    private submit() {
      this.fireSubmit({
        data: this
      });
    }
  }
```

```html
  <div>
    <form>
      <h1>ngCourse App</h1>

      <label>Enter username</label>
      <input
        type="text"
        ng-model="ctrl.username">

      <label>Password</label>
      <input
        type="password"
        ng-model="ctrl.password">

      <button
        type="submit"
        ng-click="ctrl.submit()">
        Login
      </button>
    </form>
  </div>
```

Note the use of 

```javascript
  bindToController: {
    fireSubmit: '&onSubmit'
  }
```

This is how we will pass data out of the component, through events.

And change our wiring in `app.ts`

```javascript
  ...
  .directive(
    makeSelector(LoginFormComponent),
    makeDirective(LoginFormComponent))
  ...
```

Let's change *main-component.ts* and its template to accomodate this change:

```javascript
  import {Inject} from 'utils/di';

  export class MainComponent {
    private static selector = 'ngc-main';
    private static templateUrl = '/dist/components/main/main-component.html';

    private isAuthenticated;
    private username;

    constructor( @Inject('$log') private $log) {
      this.isAuthenticated = false;
    }

    public login(data) {
      this.username = data.username;
      this.isAuthenticated = true;
    }

  };
```

```html
  <div>
    <div ng-hide="ctrl.isAuthenticated">
      <ngc-login-form on-submit="ctrl.login(data)"></ngc-login-form>
    </div>
    <div ng-show="ctrl.isAuthenticated">
      <ngc-tasks username="ctrl.username"></ngc-tasks>
    </div>
  </div>
```

The reponsibility of our `MainComponent` has changed after re-factoring. Let's rename it to `AuthenticationComponent`, it's controller class to `AuthenticationCtrl` and the selector in *app.ts* to `ngcAuthenticator`.

### Passing Data Between Components Summary

In the above sections we have seen 2 ways to pass data between components using the `bindToController` options. 

`=` to pass variables from the current component into the component.

`&` to register a callback for component to invoke (with data if necessary) in order to pass data out of the component.

`=` and `&` are the mechanism that allow our component to have a "public API".

Note, if the attribute name and the property of the component class match the name can be ommited. i.e instead of `username: '=username'` we can just write `username: '='`, with the same shortcut applying to `&`.

## Iteration with `ng-repeat`

When we have a list of items, we can use `ng-repeat` directive within our component's template to create identical DOM element for each item.

Let's modify the temaplate in *task-list-component.ts*

```html
  <div>
    <span>
      Hello, {{ ctrl.username }}!
      You've got {{ ctrl.tasks.length }} tasks.
    </span>
    <button ng-click="ctrl.addTask()">Add task</button>
  </div>

  <div>
    <div ng-repeat="task in ctrl.tasks" >
      <p>{{ task.owner }} | {{ task.description }}</p>
    </div>
  </div>
```

In the TaskListCtrl all we do is set `tasks` to an array:

```javascript
...
  export class TaskListComponent {
    ...
    private tasks;

    constructor( @Inject('$log') private $log) {
      this.tasks = [
        {
          owner: 'alice',
          description: 'Build the dog shed.'
        },
        {
          owner: 'bob',
          description: 'Get the milk.'
        },
        {
          owner: 'alice',
          description: 'Fix the door handle.'
        }
      ];
    }

    public addTask() {
      this.$log.debug('Current number of tasks:', this.tasks.length);
    }
  };
```

Note that in the template of this component we also change `{{ ctrl.numberOfTasks }}` to `{{ ctrl.tasks.length }}`.

## Structuring Applications with Components

For the sake of a simple application our `TaskListComponent` class is fine, but as the complexity and size of our application grow we want to divide responsibilities among our components further.

How should we divide responsobilities between our components? Let's start with our task list example above.

`TaskListComponent` will be responsible with retrieving and maintaining the list of tasks from the domain model. It should be able to retrieve the tasks, and it should be able to add a new task to the domain model (abstracted our in later sections).

`TaskComponent` will be responsible for a single task and displaying just that task interacting with it's parent through it's "public API"

With the above in mind, let's create the `TaskComponent` class.

```javascript
  ...
  export class TaskComponent {
    private static selector = 'ngc-task';
    private static templateUrl = '/dist/components/task/task-component.html';
    private static options = {
      bindToController: {
        task: '='
      }
    };

    private task;
    constructor( @Inject('$log') private $log) {

    }
  };
```

and its corresponding template

```html
  <p>{{ ctrl.task.owner }} | {{ ctrl.task.description }}</p>
```

What is left is to modify our *task-list-component.html*

```html
  <div>
    <span>
      Hello, {{ ctrl.username }}!
      You've got {{ ctrl.tasks.length }} tasks.
    </span>
    <button ng-click="ctrl.addTask()">Add task</button>
  </div>

  <div>
    <ngc-task ng-repeat="task in ctrl.tasks" 
        task="task">
    </ngc-task>
  </div>
```

The refactoring above illustrates and important categorisation between components, as it allows us to think of components in the following ways.

**Macro Components:** which are application specific, higher-level, container components, with access to the application's domain model.

**Micro Components:** which are components responsible for UI rendering and/or behvariour of specific entities passed in via components API (i.e component properties and events). Those components are more inline with the upcoming Web Component standards.
