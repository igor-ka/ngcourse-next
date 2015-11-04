import {Inject} from '../../utils/di';
import {UsersStore} from '../../stores/users/users-store';
import {TasksStore} from '../../stores/tasks/tasks-store';

export class TaskComponent {

  public static selector = 'ngc-task';
  public static template = require('./task-component.html');
  private static options = {
    bindToController: {
      task: '=',
      user: '='
    }
  };

  private task: any;
  private user: any;
  private errorMessage: String;

  constructor() {}
}
