# Part 13: Flux Architecture

Flux is an architectural design pattern introduced and used by Facebook as an alternative to traditional MVC patterns to build modern web applications. Flux is not a library and implementing it within your application can be done without depending on any 3rd part code. Moreover Flux is language and framework agnostic and can be used outside single web-page application and JavaScript context. The cored ideas behind Flux are inspired by game programming, specifically rendering of the changes of your domain model.

## Core Concepts

The core idea behind Flux pattern, is unidirectional data flow implemented using the four major "machines" in the Flux "pipeline", Actions, Dispatcher, Stores and the Views.

The diagram below illustrates the flow of data through the Flux "pipeline".

![alt tag] (https://facebook.github.io/flux/img/flux-simple-f8-diagram-with-client-action-1300w.png)

When the user interacts with the View (i.e. a component), the view propagates an Action through a Dispatcher (i.e. a message bus) to the Stores where your domain model or state and the application logic are stored. Once the Store updates it's domain model it propagates a "change" event to which Components in your application can subscribe, and re-render themselves accordingly to the new data.

Let's have a more in depth look at each of those parts in our "Flux machine".

### Dispatcher

Dispatcher acts as a central message bus responsible for distributing the incoming Actions to the appropriate stores. It has no logic of its own and simply acts as a hub for Action creator methods to push Actions to. Store will listen on the dispatcher for incoming Actions responding to relevant ones.

### Stores

As we mentioned above, Stores contain and manage your application's model and logic pertaining to a particular domain of your application. As a result an application will have many stores, each focused on the specific aspect of your domain. Stores are subscribed to the Dispatcher, our event bus, and listen to Actions that are relevant to them. The important part, is that nothing outside the store can modify the application state stored within it directly. Nothing outside the Store should know how the store manages it's state, and the Store can be accessed in read-only fashion, i.e. by providing getters to the outside world. In summary, the only way for a Store to modify the domain model of your application is by responding to an action coming through a Dispatcher.

## Actions

Actions are a simple objects representing an action. The usually contain and action name and an optional payload. Most of the time actions are emitted from the views.

## Views

Our views are our components

## Implementing Dispatcher and Actions

Our dispatcher is very simple, let's modify our *source/ts/app.ts* file

```javascript
  angular.module('ngcourse.dispatcher', [])
    .service('dispatcher', Rx.Subject);
```

In Chapter 12 - RxJS we have subscribed to Observables with Observers that implemented the `onNext`, `onError` and `onCompleted` methods. Rx.Subject is a combination of an Observer and Observable in one class. It is used here for convenience as you will see later.

Now, let add some actions to push onto our dispatcher later. Create a new file in *source/ts/actions/task-actions.ts*

```javascript
  import {Inject} from '../../utils/di';

  export class TaskActions {

    constructor(@Inject private dispatcher) {
      this.dispatcher = dispatcher;
    }

    getTasks() {
      this.dispatcher.onNext({
        actionType: 'GET_TASKS'
      });
    }
  }
```

It is a poor practice to use hardcoded strings like `'GET_TASKS'` above. We should extract our constants into a separate file, *source/ts/actions/action-constants.ts*

```javascript
  export const TASK_ACTIONS = {
    GET_TASKS: 'GET_TASKS',
  };
```

and let's use those constants in *task-actions.ts* instead

``` javascript
  ...
  import {TASK_ACTIONS} from '../action-constants';

  export class TaskActions {
    ...
    getTasks() {
      this.dispatcher.onNext({
        actionType: TASK_ACTIONS.GET_TASKS
      });
    }
  }

```

Great! Now we can create our first store.

## Implementing a Store

Now that we have a dispatcher and actions defined, lets start on our first Store. Let's create a new file for it in *source/ts/stores/tasks/tasks-store.ts*

```javascript
  export class TasksStore {

    private _tasks;

    constructor(
      @Inject('$log') private $log,
      @Inject('server') private server,
      @Inject('dispatcher') private dispatcher
      ) {

    }
  }
```

Our Store's domain object will be a list of tasks that we will receive from the server and our Dispatcher is available to us from constructor injection.

Before we do anything we need to listen to incoming Actions relevant to this store. Let's listen to incoming actions from our Dispatcher.

```javascript
import {Inject} from '../../utils/di';
import {TASK_ACTIONS} from '../../actions/action-constants';

export class TasksStore {

  private _tasks;

  constructor(
    @Inject('$log') private $log,
    @Inject('server') private server,
    @Inject('dispatcher') private dispatcher
    ) {
      this._tasks = [];
      this.registerActionHandlers();
  }
  
  private registerActionHandlers() {
    this.dispatcher.filter(
      action => action.actionType === TASK_ACTIONS.GET_TASKS)
        .subscribe(
          () => this.getTasks());
  }
  
  private getTasks() {
    // TODO
  }
}
```

For convenience we have created a new method on our Store called `registerActionHandlers()` where we will listen to incoming actions.
Notice how we use `filter()` method to filter the actions that are relevant to this store, in this case we are only responding to `TASK_ACTIONS.GET_TASKS` and invoking a method called `getTasks()` to process this action.

### Getting the tasks from the server

Lets retrieve some tasks from the server using our *ServerService* implemented in earlier chapters.

```javascript
  ...
   constructor(
    ...
      this._tasks = [];
      this.registerActionHandlers();
      this.getTasks();
  }
  ...
  private getTasks() {
    Rx.Observable.fromPromise(
      this.server.get('/api/v1/tasks'))
        .subscribe(tasks => this._tasks = tasks);
  }
  ...
```

Notice the use of `Rx.Observable.fromPromise` that we have covered in the previous chapter to wrap our Promise base server. This is not required and you could achieve a similar result using `then()` methods of the underlying promise. Also, we have added a call to `getTasks()` method within the constructor to initialize our store with the data at the beginning of it's lifecycle.

### Notifying Store Subscribers of State Change

So far we have implemented `getTasks()` to get the data we need from the server and store it in our domain model, i.e. `this._tasks` variable. In practice our stores will have component listening to the change on our domain model. We will implement this mechanism using what we learned about RxJS below.

```javascript
  ...
  private _tasksSubject;
  private _tasks;

  constructor(
    @Inject('$log') private $log,
    @Inject('server') private server,
    @Inject('dispatcher') private dispatcher
    ) {
      this._tasks = [];
      this._tasksSubject = new Rx.ReplaySubject(1);
      this.registerActionHandlers();
      this.getTasks();
  }
  
  get tasksSubject() {
    return this._tasksSubject;  
  }
  
  private emitChange() {
    this._tasksSubject.onNext();
  }
  
  private emitError(error) {
    this._tasksSubject.onError(error);
  }

  private registerActionHandlers() {
  ...
```


Let go through this code step by step:

1. We created a `Rx.ReplaySubject(1)` as a private instance variable to be our change notification subject. This is a special subject that will replay a value from its buffer when a new subscriber is added.
2. We have added a new getter property `get tasksSubject()`, that can be used by an observer to subscribe to and be notified whenever a change occurs to our domain model.
3. We implemented 2 utility method that we will use within our store to notify our on change observer of change to the model within the store, or an error that occurred within the store with `emitChange()` and `emitError(error)` respectively.

Now that we have all the parts in place in order to notify our observer of changes within the store, let's modify our `getTasks()` method as follows.

```javascript
  ...
  private getTasks() {
    Rx.Observable.fromPromise(
      this.server.get('/api/v1/tasks'))
        .subscribe(
          tasks => {
            this._tasks = tasks;
            this.emitChange();
          },
          error => this.emitError(error));
  }
  ...
```

## Adding Getters to our Store

Being notified of a change within the store is not enough. We need to provide our observers with a mechanism to get the data from the Store. Let's add a getter method to get our list of tasks.

```javascript
  ...
  get tasks() {
    return this._tasks;
  }
  ...
```

## Using Stores within Components

Our Store is only a part of a bigger picture, let's use our store within our `TaskListComponent` class.

```javascript
export class TaskListComponent {

  private static selector = 'ngc-tasks';
  private static templateUrl = 'components/task-list/task-list-component.html';
  private static options = {};

  private _tasks;
  private _errorMessage;

  constructor(
    @Inject('$log') private $log,
    @Inject('tasksStore') private tasksStore
    ) {

    this.tasksStore.tasksSubject.subscribe(
      tasks => this._tasks = tasks,
      error => this._errorMessage = error);
  }
  ...
```

All we are doing here is providing an observer to listen to store change events or error coming from the store. When a change occurs within the Store our Component gets notified and updates it's own (view related) list of tasks. If an error has occurred within the store the component get notified as well and can display it to the user (in some friendly form).

Since we used a `ReplaySubject` with a buffer of 1, we are guaranteed to get notified of the data within the store, even if our component got instantiated after this event has already occurred. This reduced the need to call `this.tasksStore.tasks` on each components instantiation.

Note, how we did not have to change our `TaskComponent` implementation, as a result of `TaskListComponent` passing it data from above. An important guideline with the stores, is that for the most part only top level components within your application should subscribe to them, and then pass it down to components below.

## Clean up

Even though our application is relatively small, and RxJS subscriptions are relatively lightweight on resources, we should cleanup our subscription when it is no longer needed. How do we know if the subscription is no longer needed?

There is another part of Angular we need to cover, and that is component life cycle events accessible to us via the `$scope` service.

Let's inject this service into out component as shown below:

```javascript
  ...
  constructor(@Inject('$scope') private $scope, ...)
  ...
```

since we will need to dispose of our subscription above we need to keep a reference to it when we subscribe:

```javascript
  ...
  let tasksSubscription = this.tasksStore.tasksSubject.subscribe(
    tasks => this._tasks = tasks,
    error => this._errorMessage = error);
  ...
```

Finally, let's use `$scope`'s `$on` method to subscribe to the `$destroy` even of the component in question:

```javascript
  ...
  constructor(
    @Inject('$log') private $log,
    '$scope') private $scope,
    @Inject('tasksStore') private tasksStore
    ) {

    let tasksSubscription = this.tasksStore.tasksSubject.subscribe(
      tasks => this._tasks = tasks,
      error => this._errorMessage = error);

    this.$scope.$on('$destroy', () => tasksSubscription.dispose());
  }
  ...
```

## A Case for Immutable Data

The important part is that Stores, provide read-only access to its data. As Stores should not provide setters to change their state. Technically if our `TaskListComponent` decided to change the array of `tasks` it received from the store, it in effect would change the state of the store's domain. What if a component wants to make a change to this data for some UI purposes?

This is why our stores should contain their state in the immutable data structures. To illustrate on how this can be achieved, let's refactor our `TasksStore` to use immutable for it's model. Even though there could be several ways we could achieve this, for the purposes of this example we are going to be using the `Immutable.js` library: https://facebook.github.io/immutable-js/

```javascript
  import {List, fromJS} from 'immutable';

  export class TasksStore {

    private _tasksSubject;
    private _tasks;

    constructor(
      ...
      ) {
      this._tasks = List();
      this._tasksSubject = new Rx.ReplaySubject(1);
      ...
    }
    
    get tasks() {
      return this._tasks.toJS();
    }

    ...
    private getTasks() {
      Rx.Observable.fromPromise(
        this.server.get('/api/v1/tasks'))
          .subscribe(
            tasks => {
              this._tasks = fromJS(tasks);
              this.emitChange();
            },
            error => this.emitError(error));
    }
  }
```

## Emitting Actions from Views

So far we have responded to changes within our Stores. Let's make a view that emits an Action.

Create a new file in *source/ts/components/task-add/task-add-component.ts*

```javascript
import {Inject} from '../../utils/di';

export class TaskAddComponent {

  private static selector = 'ngc-task-add';
  private static templateUrl = 'components/task-add/task-add-component.html';
  private static options = {};

  constructor(
    @Inject('$log') private $log,
    @Inject('tasksActions') private tasksActions
   ) {
     //
  }

  save(task) {
    this.tasksActions.addTask(task);
  }
}
```

and a corresponding *task-add-component.html*

```html
<div>
  <div>
    <h4>Add Task</h4>
  </div>
  <form>
    <label>Owner</label>
    <input
      type="text"
      ng-model="newTask.owner">
    <label>Description</label>
    <input
      type="text"
      ng-model="newTask.description">
    <button
      ng-click="ctrl.save(newTask)">
      Save
    </button>
  </form>
</div>
```

Let's modify our *source/ts/actions/actions-constants.ts* file to add our new action.

```javascript
  export const TASK_ACTIONS = {
    GET_TASKS: 'GET_TASKS',
    ADD_TASK: 'ADD_TASK',
  };
```

define a new action in *source/ts/actions/task-actions.ts*

```javascript
  ...
  addTask(newTask) {
    this.dispatcher.onNext({
      actionType: TASK_ACTIONS.ADD_TASK,
      newTask: newTask
    });
  }
  ...
```

and finally modify our *TaskStore* to listen on a new action and call the corresponding `addTask` method.

```javascript
  ...
  private registerActionHandlers() {
    this.dispatcher.filter(
      (action) => action.actionType === TASK_ACTIONS.GET_TASKS)
        .subscribe(
          () => this.getTasks());

    this.dispatcher.filter(
      (action) => action.actionType === TASK_ACTIONS.ADD_TASK)
        .subscribe(
          (action) => this.addTask(action.newTask));
  }

  private addTask(newTask) {
    Rx.Observable.fromPromise(
      this.server.post('/api/v1/tasks', newTask))
        .subscribe(
          () => this.getTasks(),
          error => this.emitError(error));
  }
  ...
```

Note that we are calling `getTasks()` method from within `addTask()`, which will fetch the new tasks data from the server and emit a change on successful retrieval.

