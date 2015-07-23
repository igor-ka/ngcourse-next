import {Inject} from 'utils/di';

export class TaskEditComponent {

  private static selector = 'ngc-task-edit';
  private static templateUrl = 'components/task-edit/task-edit-component.html';
  private static options = {};

  private task;
  private errorMessage;

  constructor(
    @Inject('$log') private $log,
    @Inject('tasksActions') private tasksActions,
    @Inject('tasksStore') private tasksStore,
    @Inject('$stateParams') private $stateParams,
    @Inject('router') private router
  ) {

    let taskId = this.$stateParams._id;
     
    this.task = this.tasksStore.getTaskById(taskId);
      
    this.tasksStore.getTasksObservable
      .subscribe(
        (tasks) => this.task = this.tasksStore.getTaskById(taskId),
        (error) => this.errorMessage = error
      );
  }

  updateTask(task) {
    this.tasksActions.updateTask(task);
    this.router.goToTaskList();
  }

  cancel() {
    this.router.goToTaskList();
  }
}