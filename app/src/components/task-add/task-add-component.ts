import {Inject} from '../../utils/di';
import {TaskActions} from '../../actions/task/task-actions';
import {RouterService} from '../../services/router/router-service';

export class TaskAddComponent {

  private static selector = 'ngc-task-add';
  private static template = require('./task-add-component.html');
  private static options = {};

  constructor(
    @Inject('router') 
      private router: RouterService,
    @Inject('tasksActions') 
      private tasksActions: TaskActions
   ) {}

  save(task) {
    this.tasksActions.addTask(task);
    this.router.goToTaskList();
  }

  cancel() {
    this.router.goToTaskList();
  }
}
