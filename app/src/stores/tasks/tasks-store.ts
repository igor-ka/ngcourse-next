import {TASK_ACTIONS} from '../../actions/action-constants';
import {Task} from '../../services'
import * as Rx from 'rx';

export class TasksStore {
  
  private _tasks: Rx.ReplaySubject<Task[]>;
  private _error: Rx.ReplaySubject<any>;

  static $inject = [
    'koast',
    'dispatcher'
  ];

  constructor(
    private koast,
    private dispatcher: Rx.Subject<any>) {
    
    this._tasks = new Rx.ReplaySubject<Task[]>(1);
    this._error = new Rx.ReplaySubject(1);
    
    this.registerActionHandlers();
  }
  
  get tasks() {
    return this._tasks;
  }
  
  get error() {
    return this._error;
  }
  
  private registerActionHandlers() {
    this.dispatcher.filter(
      action => action.actionType === TASK_ACTIONS.GET_TASKS_RESPONSE)
        .subscribe(action => this._tasks.onNext(action.tasks));
      
    this.dispatcher.filter(
      action => action.actionType === TASK_ACTIONS.GET_TASKS_RESPONSE_ERROR)
        .subscribe(action => this._error.onNext({
          type: action.actionType, 
          error: action.error 
        }));
  }

  getTaskById(id) {
    return this._tasks
      .flatMap(tasks => Rx.Observable.from(tasks)
        .filter(task => task._id === id))
        .map(task => angular.copy(task));
  }

}
