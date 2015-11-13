import {UsersStore} from '../../stores/users/users-store';
import {TasksStore} from '../../stores/tasks/tasks-store';

export class TaskComponent {

  private task: any;
  private user: any;
  private errorMessage: String;
  private onDelete: Function;

  static selector = 'ngcTask';

  static directiveFactory: ng.IDirectiveFactory = () => {
    return {
      restrict: 'E',
      scope: {},
      controllerAs: 'ctrl',
      bindToController: {
        task: '=',
        user: '=',
        onDelete: '&'
      },
      controller: TaskComponent,
      template: require('./task-component.html')
    };
  };

  constructor() { }
  
  delete() {
    this.onDelete({
      data: this.task
    });
  }
}
