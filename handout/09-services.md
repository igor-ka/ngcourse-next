# Part 9: Services

In Part 7 we wrote functions that call `$http` methods and process resulting
promises. We started by putting those functions in our controller. This,
however, is a poor practice. Those functions are working with business logic
and they should be kept out of controllers.

## Services

Instead, we'll put those functions in an AngularJS service. Let's put this in *src/services/tasks/tasks-service.ts*

```javascript
/// <reference path="../../../typings/tsd.d.ts" />
import {Inject} from 'utils/di';

export class TasksService {

  constructor(@Inject('$http') private $http) { }

  public getTasks () {
    return this.$http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
      .then(function(response) {
        return response.data;
      });
  };
}
```

Note we have added a new module definition and need to update *app.ts*.

```javascript
  ...
  import {TasksService} from 'services/tasks/tasks-service';
  ...
  angular.module('ngcourse', [])
    ...
    .service('tasksService', TasksService)
    .directive(
      makeSelector(TaskListComponent),
      makeDirective(TaskListComponent))
    .directive(
      makeSelector(TaskComponent),
      makeDirective(TaskComponent))
  ...    
```

We can now simplify our code code to use this service:

```javascript
  ...
  export class TaskListComponent {
    ...
    constructor(
      @Inject('$log') private $log,
      @Inject('tasksService') private tasksService
      ) {
        this.tasksService.getTasks()
          .then((tasks) => this.tasks = tasks);
    }
```

Note that we've injected our newly created service.

## Advantages of Keeping Code in Services

Let's discuss some of the advantages of keeping this type of code in services rather than in components.

The rule of thumb: code that can be written without referring to a
controller's scope should be written this way and should be placed in a
service.

## More Services

When it comes to services, the more the better. Let's refactor some of the
code from our `tasks` service into a new `server` service *src/services/server/server-service.ts*.

```javascript
  /// <reference path="../../../typings/tsd.d.ts" />
  import {Inject} from 'utils/di';

  export class ServerService {

    private baseUrl = 'http://ngcourse.herokuapp.com';

    constructor(@Inject('$http') private $http) { }
      
    public get(path) {
      return this.$http.get(this.baseUrl + path)
        .then(function(response) {
          return response.data;
        });
    }
  }
```

Again, let's add a new definition in *app.ts*.

```javascript
  ...
  import {ServerService} from 'services/server/server-service';
  ...
  angular.module('ngcourse', [])
    ...
    .service('server', ServerService);
  ...    
```

While our `TaskService` code gets simplified to:

```javascript
  /// <reference path="../../../typings/tsd.d.ts" />
  import {Inject} from 'utils/di';

  export class TasksService {

    constructor(@Inject('serverService') private serverService) { }

    public getTasks () {
      return this.serverService.get('/api/v1/tasks');
    };
  }
```

And we have a layered service architecture with the tasks service calling the server service.

But why bother, you might ask? Lets go over some of the benefits.

## Using `.constant()` and `.value()`

We could decompose yet more, though:

```javascript
  angular.module('ngcourse', [])
    ...
    .constant('API_BASE_URL', 'http://ngcourse.herokuapp.com')
    .service('serverService', ServerService);
```

and 

```javascript
import {Inject} from 'utils/di';

export class ServerService {

  constructor(
    @Inject('$http') private $http,
    @Inject('API_BASE_URL') private API_BASE_URL) { }
    
  public get(path) {
    return this.$http.get(this.API_BASE_URL + path)
      .then(function(response) {
        return response.data;
      });
  }
}
```

Alternatively, we can use `.value()` instead of `.constant()`. However, when
in doubt, use `.constant()`.

## Modules

At this point we may want to consider breaking our code up into modules. E.g.,
let's make `server` its own module:

```javascript
  angular.module('ngcourse.server', [])
    ...
    .constant('API_BASE_URL', 'http://ngcourse.herokuapp.com')
    .service('serverService', ServerService);
```

We can then make it a dependency in our `ngcourse` module (in `app.js`):

```javascript
  angular.module('ngcourse', [
    'ngcourse.server'
  ]);
```

Note that an Angular "app" is basically just an Angular module.

Each module can define `.config()` and `.run()` sections. You will rarely see
`.config()` except when setting up routes. (We'll discuss it in that context.)
Your `.run()` is essentially you modules's equivalent of the "main" block.

```javascript
  angular.module('ngcourse', [
    'ngcourse.server'
  ])

  .run(function($log) {
    $log.info('All ready!');
  });
```

Keep in mind, though, that Angular's modules are somewhat of a fiction.
