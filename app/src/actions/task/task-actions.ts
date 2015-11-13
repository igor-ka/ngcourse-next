import {TASK_ACTIONS} from '../action-constants';
import {TasksService} from '../../services';

export class TaskActions {

  static $inject = ['dispatcher', 'tasksService'];

  constructor(
    private dispatcher: Rx.Subject<any>,
    private tasksService: TasksService) { }

  getTasks() {
    this.tasksService.getTasks()
      .then(tasks => this.dispatcher.onNext({
        actionType: TASK_ACTIONS.GET_TASKS_RESPONSE,
        tasks: tasks
      }))
      .then(null, error => this.dispatcher.onNext({
        actionType: TASK_ACTIONS.GET_TASKS_RESPONSE_ERROR,
        error: error
      }));
  }

  addTask(newTask) {
    this.tasksService.addTask(newTask)
      .then(this.getTasks)
      .then(null, error => this.dispatcher.onNext({
        actionType: TASK_ACTIONS.GET_TASKS_RESPONSE_ERROR,
        error: error
      }));
  }

  updateTask(task) {
    this.tasksService.updateTask(task)
      .then(this.getTasks)
      .then(null, error => this.dispatcher.onNext({
        actionType: TASK_ACTIONS.GET_TASKS_RESPONSE_ERROR,
        error: error
      }));
  }

  deleteTask(task) {
    this.tasksService.deleteTask(task)
      .then(this.getTasks)
      .then(null, error => this.dispatcher.onNext({
        actionType: TASK_ACTIONS.GET_TASKS_RESPONSE_ERROR,
        error: error
      }));
  }

}
