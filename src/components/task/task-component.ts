/// <reference path="../../../typings/tsd.d.ts" />
import {Inject} from 'utils/di';
import {UsersStore} from 'stores/users/users-store';
import {TasksStore} from 'stores/tasks/tasks-store';

export class TaskComponent {

  public static selector = 'ngc-task';
  public static templateUrl = 'components/task/task-component.html';
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
    @Inject('$log') private $log
    ) {
  }
};