import {TASK_ACTIONS} from '../../actions/action-constants';
import {Task} from '../../services';
import * as Rx from 'rx';

export class TasksStore {
  
  private _tasks: Rx.ReplaySubject<Task[]>;
  private _error: Rx.ReplaySubject<any>;

  static $inject = [
    'dispatcher'
  ];

  constructor(private dispatcher: Rx.Subject<any>) {
    
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
    return this.tasks
      .map(tasks => tasks.find(task => task._id === id));
  }
}
