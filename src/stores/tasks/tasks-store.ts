/// <reference path="../../../typings/tsd.d.ts" />
import {Inject} from 'utils/di';
import {makeAuthenticatedMethod} from 'utils/store-utils'
import {TASK_ACTIONS} from 'constants/action-constants';
import {List, fromJS} from 'immutable';

export class TasksStore {

  private _tasksSubject: Rx.ReplaySubject<Object>;
  private _tasks;
  
  /* Authenticated methods */
  private getTasks: Function;
  private addTask: Function;
  private updateTask: Function;
  private deleteTask: Function;
  private getTask: Function;

  constructor(
    @Inject('$log') private $log,
    @Inject('koast') private koast,
    @Inject('dispatcher') private dispatcher
  ) {
    this.registerActionHandlers();
    this.addAuthenticatedMethods();
    this.initialize();
  }

  private initialize() {
    this._tasks = List();
    this._tasksSubject = new Rx.ReplaySubject(1);
    //this.getTasks();
  }
  
  get subject() {
    return this._tasksSubject;  
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
  }

  private addAuthenticatedMethods() {

    this.getTasks = makeAuthenticatedMethod(
      this.koast,
      () => Rx.Observable.fromPromise(
        this.koast.queryForResources('tasks'))
          .subscribe(
            (tasks) => {
              this._tasks = fromJS(tasks);
              this.emitChange();
            },
            (error) => this.emitError(error))
      );

    this.getTask = makeAuthenticatedMethod(
      this.koast,
      (id) => this.koast.getResource('tasks', { _id: id })
      );

    this.addTask = makeAuthenticatedMethod(
      this.koast,
      (task) => Rx.Observable.fromPromise(
        this.koast.createResource('tasks', task))
          .subscribe(() => this.getTasks())
      );

    this.updateTask = makeAuthenticatedMethod(
      this.koast,
      (task) => task.save()
        .then(this.getTasks)
      );
  }

  public addChangeListener(observer) {
    this._tasksSubject.subscribe(observer);
  }

  private emitChange() {
    this._tasksSubject.onNext(this.tasks);
  }

  private emitError(error) {
    this._tasksSubject.onError(error);
  }

  get tasks() {
    return this._tasks.toJS();
  }

  public getTaskById(id) {
    return this.tasks.filter(
      (task) => task._id === id)[0];
  }

}
