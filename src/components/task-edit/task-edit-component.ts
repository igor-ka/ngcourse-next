/// <reference path="../../../typings/tsd.d.ts" />
import {Inject} from 'utils/di';

export class TaskEditComponent {

  private static selector = 'ngc-task-edit';
  private static templateUrl = 'components/task-edit/task-edit-component.html';
  private static options = {};

  private _task;
  private _errorMessage;

  constructor(
    @Inject('$log') private $log,
    @Inject('tasksActions') private tasksActions,
    @Inject('tasksStore') private tasksStore,
    @Inject('$stateParams') private $stateParams,
    @Inject('router') private router
  ) {

    let taskId = this.$stateParams._id;
      
    this.tasksStore.tasksSubject.subscribe(
      Rx.Observer.create(
        (tasks) => this._task = this.tasksStore.getTaskById(taskId),
        (error) => this._errorMessage = error
      ));
  }

  updateTask(task) {
    this.tasksActions.updateTask(task);
    this.router.goToTaskList();
  }

  cancel() {
    this.router.goToTaskList();
  }
  
  get task() {
    return this._task;
  }
  
  get errorMessage() {
    return this._errorMessage;
  }
}