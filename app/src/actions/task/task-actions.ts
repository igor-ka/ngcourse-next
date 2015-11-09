import {TASK_ACTIONS} from '../action-constants';

export class TaskActions {

  static $inject = ['dispatcher'];

  constructor(
    private dispatcher: Rx.Subject<any>) { }

  getTasks() {
    this.dispatcher.onNext({
      actionType: TASK_ACTIONS.GET_TASKS
    });
  }

  addTask(newTask) {
    this.dispatcher.onNext({
      actionType: TASK_ACTIONS.ADD_TASK,
      newTask: newTask
    });
  }

  updateTask(task) {
    this.dispatcher.onNext({
      actionType: TASK_ACTIONS.UPDATE_TASK,
      task: task
    });
  }
}
