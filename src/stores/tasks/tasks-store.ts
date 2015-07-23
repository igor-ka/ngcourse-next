/// <reference path="../../../typings/tsd.d.ts" />
import {Inject} from 'utils/di';
import {TASK_ACTIONS} from 'constants/action-constants';
import {List, fromJS} from 'immutable';
import 'rx';

export class TasksStore {

  private tasksObservable;
  private tasks;
  
  /* Authenticated methods */
  private getTasks: Function;
  private addTask: Function;
  private updateTask: Function;
  private deleteTask: Function;
  private getTask: Function;

  constructor(
    @Inject('$log') private $log,
    @Inject('koast') private koast,
    @Inject('usersStore') private usersStore,
    @Inject('dispatcher') private dispatcher
    ) {
    this.addAuthenticatedMethods();
    this.setInitialState();
    this.registerActionHandlers();
  }

  get getTasksObservable() {
    return this.tasksObservable;
  }
  
  get currentTasks() {
    return this.tasks.toJS();
  }
  
  public getTaskById(id) {
    return this.tasks.toJS().filter(
      (task) => task._id === id)[0];
  }
  
  private setInitialState() {
    this.tasks = List();
    this.tasksObservable = new Rx.Subject();
    this.getTasks();
  }
  
  private registerActionHandlers() {
    this.dispatcher.filter(
      (action) => action.actionType === TASK_ACTIONS.GET_TASKS)
        .subscribe(
          () => this.getTasks());

    this.dispatcher.filter(
      (action) => action.actionType === TASK_ACTIONS.ADD_TASK)
        .subscribe(
          (action) => this.addTask(action.newTask));
        
    this.dispatcher.filter(
      (action) => action.actionType === TASK_ACTIONS.UPDATE_TASK)
        .subscribe(
          (action) => this.updateTask(action.task));
          
    this.dispatcher.filter(
      (action) => action.actionType === TASK_ACTIONS.DELETE_TASK)
        .subscribe(
          (action) => this.deleteTask(action.task)); 
  }
  
  private addAuthenticatedMethods() {
    this.getTasks = this.makeAuthenticatedMethod(
      () => Rx.Observable.fromPromise(
        this.koast.queryForResources('tasks'))
          .subscribe(
            (tasks) => {
              this.tasks = fromJS(tasks);
              this.tasksObservable.onNext(this.tasks.toJS());
            },
            (error) => this.tasksObservable.onError(error))
    );

    this.getTask = this.makeAuthenticatedMethod(
      (id) => this.koast.getResource('tasks', { _id: id})
    );
    
    this.addTask = this.makeAuthenticatedMethod(
      (task) => Rx.Observable.fromPromise(
        this.koast.createResource('tasks', task))
          .subscribe(() => this.getTasks())
    );

    this.updateTask = this.makeAuthenticatedMethod(
      (task) => task.save()
        .then(this.getTasks)
    );
    
    this.deleteTask = this.makeAuthenticatedMethod(
      (task) => task.delete()
        .then(this.getTasks)
    );
  }
  
  private makeAuthenticatedMethod(method) {
    return function () {
      let methodArgs = arguments;
      return this.koast.user.whenAuthenticated()
        .then(() => method.apply(this, methodArgs));
    };
  }
}
