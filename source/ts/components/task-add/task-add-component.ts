import {Inject} from 'utils/di';

export class TaskAddComponent {

  private static selector = 'ngc-task-add';
  private static templateUrl = 'components/task-add/task-add-component.html';
  private static options = {};

  constructor(
    @Inject('$log') private $log,
    @Inject('router') private router,
    @Inject('tasksActions') private tasksActions
   ) {
     //
  }

  save(task) {
    this.tasksActions.addTask(task);
    this.router.goToTaskList();
  }

  cancel() {
    this.router.goToTaskList();
  }
}