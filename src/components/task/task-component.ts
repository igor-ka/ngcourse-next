/// <reference path="../../../typings/tsd.d.ts" />
import {Inject} from 'utils/di';
import {UsersStore} from 'stores/users/users-store';
import {TasksStore} from 'stores/tasks/tasks-store';

export class TaskComponent {

  private static selector = 'ngc-task';
  private static templateUrl = 'components/task/task-component.html';
  private static options = {
    bindToController: {
      task: '=',
      user: '='
    }
  };

  private task;
  private user;
  private errorMessage;

  constructor(
    @Inject('$log') private $log,
    @Inject('router') private router,
    @Inject('tasksActions') private tasksActions
    ) {
  }
  
  private deleteTask() {
    this.tasksActions.deleteTask(this.task);
  }
};