import {TasksStore} from '../../stores/tasks/tasks-store';
import {UsersStore} from '../../stores/users/users-store';
import {RouterService} from '../../services/router/router-service';
import {AuthenticationStore}
from '../../stores/authentication/authentication-store';
import {TaskActions} from '../../actions/task/task-actions';

export class TaskListComponent {

  private _tasks: any[];
  private _users: {};
  private _user: any;
  private _displayName: String;
  private _errorMessage: String;

  static selector = 'ngcTasks';

  static directiveFactory: ng.IDirectiveFactory = () => ({
    restrict: 'E',
    controllerAs: 'ctrl',
    scope: {},
    bindToController: true,
    controller: TaskListComponent,
    template: require('./task-list-component.html')
  });

  static $inject = [
    '$scope',
    'router',
    'authenticationStore',
    'tasksStore',
    'usersStore'
  ];

  constructor(
    private $scope: ng.IScope,
    private router: RouterService,
    private authenticationStore: AuthenticationStore,
    private tasksStore: TasksStore,
    private usersStore: UsersStore
  ) {

    let authSubscription = this.authenticationStore.userSubject.subscribe(
      user => this._user = user,
      error => this._errorMessage = error);

    let tasksSubscription = this.tasksStore.tasksSubject.subscribe(
      tasks => this._tasks = tasks,
      error => this._errorMessage = error);

    let usersSubscription = this.usersStore.usersSubject.subscribe(
      users => {
        this._users = users;
        this._displayName = users[this.user.data.username].displayName;
      },
      error => this._errorMessage = error);

    this.$scope.$on('$destroy', () => {
      authSubscription.dispose();
      tasksSubscription.dispose();
      usersSubscription.dispose();
    });
  }

  get tasks() {
    return this._tasks;
  }

  get displayName() {
    return this._displayName;
  }

  get user() {
    return this._user;
  }

  get users() {
    return this._users;
  }

  get errorMessage() {
    return this._errorMessage;
  }
}
