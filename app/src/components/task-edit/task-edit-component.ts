import {Inject} from '../../utils/di';
import {TaskActions} from '../../actions/task/task-actions';
import {RouterService} from '../../services/router/router-service';
import {TasksStore} from '../../stores/tasks/tasks-store';

export class TaskEditComponent {

  private static selector = 'ngc-task-edit';
  private static template = require('./task-edit-component.html');
  private static options = {};

  private _task: any;
  private _errorMessage: String;

  constructor(
    @Inject('$scope') 
      private $scope: angular.IScope,
    @Inject('tasksActions') 
      private tasksActions: TaskActions,
    @Inject('tasksStore') 
      private tasksStore: TasksStore,
    @Inject('$stateParams') 
      private $stateParams,
    @Inject('router') 
      private router: RouterService
  ) {
    let tasksSubscription = 
      this.tasksStore.tasksSubject.subscribe(
        tasks => 
          this._task = this.tasksStore.getTaskById(this.$stateParams._id),
        error => this._errorMessage = error);
      
    this.$scope.$on('$destroy', () => {
      tasksSubscription.dispose();
    });
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
