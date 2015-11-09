# Part 5: Getting Started with the Client

This course will be organized around building a collaborative task manager. We will start by building a client app, which we will later connect to a REST API. Our first task is to setup a simple Angular app consisting of a few **components**, and to understand how they fit together. 

We'll be making use of common built-in directives such as `ng-model`, `ng-show`, `ng-hide`, `ng-cloak`, `ng-if`, `ng-repeat`. We will also discuss Angular’s dependency injection and the use of `$log` for logging.

## The Most Trivial Angular App

Let's start by setting up a really simple angular app -- so simple in fact that it won't do anything at all. Here is what we'll put in our *index.html* file.

```html
<!DOCTYPE html>
<html>

  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <title>NgCourse-Next Demo Application</title>
  </head>
  <body>
    <div>Hello World!</div>
  </body>
</html>
```

We'll also need a very simple TypeScript file - our "app":

```javascript
angular.module('ngcourse', []);

angular.element(document).ready(
  () => angular.bootstrap(document, ['ngcourse'])
);
```

# Angular 1.x Basics

This app doesn't do anything at all. To make it do something remotely interesting we'll need to define a directive. 

## Directives

In Angular 1.x, directives are the building blocks of your application. Directives can be described as markers on the DOM tree that allow to define custom behaviour and/or transformations on that DOM element.

Let's define a basic directive in our *app/src/app.ts* file to see this in action,

```javascript
  ...
  angular.module('ngcourse', [])
    .directive('ngcMain', () => ({
        restrict: 'E', // vs 'A', 'AE'
        replace: true,
        scope: {}, // vs 'true', 'null'
        template: '<span>Hello World from Directive!</span>'
      })
    );
  ...
```

Note the way `angular.module()` is invoked in these two files. The `module` function can be used in two ways.

1. `angular.module('ngcourse', ['ngcourse.directives'])` defines a new module with a name of 'ngcourse' that has dependencies on other modules specified in the dependency array pointing to other modules by name. *(More on AngularJS' dependency injection will be covered later)*.
2. `angular.module('ngcourse')` which accesses a module that has already been defined.

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
  .directive('ngcMain', () => ({
      ...
      transclude: true,
      template: '<span>Hello World from Directive! <div ng-transclude/></span>'
    })
  );
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
  .directive('ngcMain', () => ({
      restrict: 'E',
      replace: true,
      scope: {},
      template: '<span>Hello, {{ ctrl.userDisplayName }}.</span>',
      controller: MainDirectiveCtrl,
      controllerAs: 'ctrl',
      bindToController: true
    })
  );
```

Note Angular's `{{ }}` syntax, referred to as the double moustache, used here
to bind controller's property to the template.

Let's recap:

### Template
The template is just an HTML snippet defining a view that represent this directive. Templates have access to any properties or functions defined on the directive's controller scope.

### Controller
The controller is just an ES6 class that backs component's view represented by a template. The template above binds the `userDisplayName` property defined on the `MainDirectiveCtrl` controller class using the double-moustache syntax `{{ ctrl.userDisplayName }}`.

## Using an External Template

Our templates are usually too complex to include as a string. So, instead we often provide a URL to the template file by using `templateUrl` instead of the `template` option in our Directive Definition Object (DDO).

Let's create a new directory *app/src/components/main/* and extract our template into a html file called *main-component.html*. Our templateUrl option should now point to *components/main/main-component.html*.

## Using an External Controller Class

In the same fashion we should extract our controller class into a separate file, as we want to avoid clutter when our application grows.

Create a file called *main-component.ts* in the *app/src/components/main/main/* folder and move our controller class definition there.

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
import {MainDirectiveCtrl} from './components/main/main-component';
...
angular.module('ngcourse', []);

angular.module('ngcourse')
  .directive('ngcMain', () => ({
      restrict: 'E',
      scope: {},
      template: require('./main-component.html'),
      controller: MainDirectiveCtrl,
      controllerAs: 'ctrl',
      bindToController: true
    })
  );

angular.element(document).ready(
  () => angular.bootstrap(document, ['ngcourse'])
);
...
```

## Using `require` to load an external template

Let's discuss the use of `require` to load an external template and how this is achieved using webpack's raw loader.

**Note**: Even though it is technically possible to use ES6 style imports to load the template, `require` ends up being cleaner.

With Angular 1.x basics out of the way we can start talking about...

# Components

As directive in Angular 1.x, in Angular 2, components are the building blocks of your application. As a matter of fact what we built in the previous section is referred to as **Component Directive** within Angular 1.x context. 

Angular 2's components are conceptually similar to component directives from Angular 1.x. The structure of Angular 2 application can be viewed as the tree of components, with a root element of that tree being the entry point of your application.

In summary, component is an object that structures and represents a UI element. It consists of two parts, component **controller** in charge of view logic and component **template** representing the view.

With that in mind let's define a basic component in a separate typescript file 
located in *app/src/components/main/main-component.ts*:

```javascript
export class MainComponent {

  private username;
  private numberOfTasks;

  static selector = 'ngcMain';

  static directiveFactory: ng.IDirectiveFactory = () => {
    return {
      restrict: 'E',
      scope: {},
      template: require('./main-component.html'),
      controller: MainDirectiveCtrl,
      controllerAs: 'ctrl',
      bindToController: true
    };
  };
  
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
angular.module('ngcourse')
  .directive(
    MainComponent.selector,
    MainComponent.directiveFactory);
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
    static $inject = ['$log'];
    ...
    constructor( private $log ) { 
      ...
    }

    public addTask() {
      this.$log.debug('Current number of tasks:', this.numberOfTasks);
      this.numberOfTasks += 1;
    }
  }
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
    static $inject = ['$log', '$scope'];
    ...
    constructor(private $log, private $scope) { 
    ...
  }
  ...
```

is equivalent to this (Don't do this!):

```javascript
  ...
  export class MainComponent {
    ...
    static $inject = ['$log', '$scope'];
    ...
    constructor(private $a, private $b) { 
    ...
  }
  ...
```

But this:

```javascript
  ...
  export class MainComponent {
    ...
    static $inject = ['$log', '$scope'];
    ...
    constructor(private $scope, private $log) { 
    ...
  }
  ...
```

Will not work at all. 

In short, the order of parameters in the `$inject` property relative to the class constructor is important.

## Two-Way Data Binding with `ng-model`

We can also control our component's property value from within the HTML.
Modify the template of our component to include the following:

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

In the above example, the `ng-model` directive bi-directionally binds an element to our component's class property. Note that if the property does not exist on the controller, it will be created.

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
    constructor(private $log ) { 
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

By this point our component is getting unwieldy. Let's split it into two separate components. 

The first component will be located in *app/src/components/task-list/task-list-component.ts* and will implement our simple task counter.

```javascript

  export class TaskListComponent {
    
    private numberOfTasks;
    
    static selector = 'ngcTasks';

    static directiveFactory: ng.IDirectiveFactory = () => ({
      restrict: 'E',
      controllerAs: 'ctrl',
      scope: {},
      bindToController: true,
      controller: TaskListComponent,
      template: require('./task-list-component.html')
    });
  
    constructor(private $log ) {
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

  export class MainComponent {
    
    private isAuthenticated;
    ...
    constructor(private $log) { 
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
  import {MainComponent} from './components/main/main-component';
  import {TaskListComponent} from './components/task-list/task-list-component';
  ...
  angular.module('ngcourse')
    .directive(
      MainComponent.selector,
      MainComponent.directiveFactory)
    .directive(
      TaskListComponent.selector, 
      TaskListComponent.directiveFactory);

  angular.element(document).ready(
    () => angular.bootstrap(document, ['ngcourse'])
  );
```
## Simplifying `import`s

We can simplify our `import` statements further to make our life, just a little bit easier.
Let's create a new file, *app/src/components/index,ts* and put the following code in there.

```javascript
  export * from './task-list/task-list-component';
  export * from './main/main-component';
```

Now in our app.ts we can change our import statement to the following:

```javascript
  import {MainComponent, TaskListComponent} from './components/index';
...
```

ES6's module system is smart enough to figure out that *index.ts* is the default file in the directory.
So we can simplofy this even further.

```javascript
  import {MainComponent, TaskListComponent} from './components';
  ...
```

## Application Structure with Components

A useful way of conceptualizing Angular application design is to look at it as a tree of nested components each having an isolated scope. 

Let's try adding another `<ngc-tasks></ngc-tasks>` element to the template of a component we defined in *app/src/components/main/main-component.ts* and observe what happens in the browser.

### Passing Data Between Components

We have introduced a bug during our re-factoring, the username is not displayed when  `TaskListComponent` is shown. Let's modify *task-list-component.ts* and fix it:

```javascript
  ...
  export class TaskListComponent {
    
    static directiveFactory: ng.IDirectiveFactory = () => ({
      restrict: 'E',
      controllerAs: 'ctrl',
      scope: {},
      bindToController: {
        username: '=username'
      },
      controller: TaskListComponent,
      template: require('./task-list-component.html')
    });
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

Let's restructure our code further and create a new component to handle the login form for us. We will put this component in a new file *app/src/components/login-form/login-form-component.ts* and create an html template file for it as well.

```javascript

  export class LoginFormComponent {

    static selector = 'ngcLoginForm';

    static directiveFactory: ng.IDirectiveFactory = () => {
      return {
        restrict: 'E',
        scope: {},
        controllerAs: 'ctrl',
        bindToController: {
          fireSubmit: '&onSubmit'
        },
        controller: LoginFormComponent,
        template: require('./login-form-component.html')
      };
    };
    
    private username;
    private password;
    private fireSubmit: Function;

    constructor() {
      //
    }

    public submit() {
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
    LoginFormComponent.selector,
    LoginFormComponent.directiveFactory)
  ...
```

Let's change *main-component.ts* and its template to accomodate this change:

```javascript

  export class MainComponent {

    static selector = 'ngcMain';
    
    static directiveFactory: ng.IDirectiveFactory = () => {
      return {
        transclude: true,
        restrict: 'E',
        scope: {},
        controllerAs: 'ctrl',
        bindToController: true,
        controller: MainComponent,
        template: require('./main-component.html')
      };
    };
  
    private isAuthenticated;
    private username;

    constructor(private $log) {
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

### Passing Data Between Components Summary

In the above sections we have seen 2 ways to pass data between components using the `bindToController` options. 

`=` to pass variables from the current component into the component.

`&` to register a callback for component to invoke (with data if necessary) in order to pass data out of the component.

`=` and `&` are the mechanism that allow our component to have a "public API".

Note, if the attribute name and the property of the component class match the name can be omitted. i.e instead of `username: '=username'` we can just write `username: '='`, with the same shortcut applying to `&`.

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

In the TaskListComponent all we do is set `tasks` to an array:

```javascript
...
  export class TaskListComponent {
    ...
    private tasks;

    constructor(private $log) {
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

How should we divide responsibilities between our components? Let's start with our task list example above.

`TaskListComponent` will be responsible with retrieving and maintaining the list of tasks from the domain model. It should be able to retrieve the tasks, and it should be able to add a new task to the domain model (abstracted our in later sections).

`TaskComponent` will be responsible for a single task and displaying just that task interacting with it's parent through it's "public API"

With the above in mind, let's create the `TaskComponent` class.

```javascript
  ...
  export class TaskComponent {

    static selector = 'ngcTask';
  
    static directiveFactory: ng.IDirectiveFactory = () => {
      return {
        restrict: 'E',
        scope: {},
        controllerAs: 'ctrl',
        bindToController: {
          task: '='
        },
        controller: TaskComponent,
        template: require('./task-component.html')
      };
    };
  
    private task;
    constructor(private $log) {

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

The refactoring above illustrates and important categorization between components, as it allows us to think of components in the following ways.

**Macro Components:** which are application specific, higher-level, container components, with access to the application's domain model.

**Micro Components:** which are components responsible for UI rendering and/or behaviour of specific entities passed in via components API (i.e component properties and events). Those components are more inline with the upcoming Web Component standards.