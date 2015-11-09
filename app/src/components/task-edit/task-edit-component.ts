import {TaskActions} from '../../actions/task/task-actions';
import {RouterService} from '../../services/router/router-service';
import {TasksStore} from '../../stores/tasks/tasks-store';

export class TaskEditComponent {

  private _task: any;
  private _errorMessage: String;

  static selector = 'ngcTaskEdit';
  
  static directiveFactory: ng.IDirectiveFactory = () => {
    return {
      restrict: 'E',
      scope: {},
      controllerAs: 'ctrl',
      bindToController: true,
      controller: TaskEditComponent,
      template: require('./task-edit-component.html')
    };
  };

  static $inject = [
    '$scope',
    'tasksActions',
    'tasksStore',
    '$stateParams',
    'router'
  ];
  
  constructor(
    private $scope: angular.IScope,
    private tasksActions: TaskActions,
    private tasksStore: TasksStore,
    private $stateParams,
    private router: RouterService
  ) {
    let tasksSubscription = 
      this.tasksStore.getTaskById(this.$stateParams._id)
      .subscribe(
        task => this._task = task,
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
