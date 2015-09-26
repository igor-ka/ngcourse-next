import {Inject} from '../../utils/di';
import {makeAuthenticatedMethod} from '../../utils/store-utils';
import {TASK_ACTIONS} from '../../actions/action-constants';

import {List, fromJS} from 'immutable';
import * as Rx from 'rx.all';

export class TasksStore {
  private _tasksSubject: Rx.ReplaySubject<any>;
  private _tasks: List<any>;

  /* Authenticated methods */
  private getTasks: Function;
  private addTask: Function;
  private updateTask: Function;
  private deleteTask: Function;
  private getTask: Function;

  constructor(
    @Inject('koast') 
      private koast,
    @Inject('dispatcher') 
      private dispatcher: Rx.Subject<any>
  ) {
    this.registerActionHandlers();
    this.addAuthenticatedMethods();
    this.initialize();
  }

  private initialize() {
    this._tasks = List();
    this._tasksSubject = new Rx.ReplaySubject(1);
    this.getTasks();
  }
  
  get tasksSubject() {
    return this._tasksSubject;  
  }
  
  private registerActionHandlers() {
    this.dispatcher.filter(
      action => action.actionType === TASK_ACTIONS.GET_TASKS)
        .subscribe(action => this.getTasks());

    this.dispatcher.filter(
      action => action.actionType === TASK_ACTIONS.ADD_TASK)
        .subscribe(action => this.addTask(action.newTask));

    this.dispatcher.filter(
      action => action.actionType === TASK_ACTIONS.UPDATE_TASK)
        .subscribe(action => this.updateTask(action.task));
  }

  private addAuthenticatedMethods() {

    this.getTasks = makeAuthenticatedMethod(
      this.koast,
      () => Rx.Observable.fromPromise(
        this.koast.queryForResources('tasks'))
          .subscribe(
            tasks => {
              this._tasks = fromJS(tasks);
              this.emitChange();
            },
            error => this.emitError(error))
      );

    this.getTask = makeAuthenticatedMethod(
      this.koast,
      id => this.koast.getResource('tasks', { _id: id })
      );
      
    this.addTask = makeAuthenticatedMethod(
      this.koast,
      task => Rx.Observable.fromPromise(
        this.koast.createResource('tasks', task))
          .subscribe(() => this.getTasks())
      );

    this.updateTask = makeAuthenticatedMethod(
      this.koast,
      task => task.save()
        .then(this.getTasks)
      );
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
    return this._tasks.find(
      task => task._id === id);
  }

}
