import {TasksStore} from '../../stores/tasks/tasks-store';
import {UsersStore} from '../../stores/users/users-store';
import {RouterService} from '../../services/router/router-service';
import {AuthenticationStore}
from '../../stores/authentication/authentication-store';
import {TaskActions} from '../../actions/task/task-actions';

import {User, Task} from '../../services';

export class TaskListComponent {

  tasks: Task[];
  users: {};
  user;
  errorMessage: String;
  
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
    'usersStore',
    'tasksActions'
  ];

  constructor(
    private $scope: ng.IScope,
    private router: RouterService,
    private authenticationStore: AuthenticationStore,
    private tasksStore: TasksStore,
    private usersStore: UsersStore,
    private tasksActions: TaskActions
  ) {

    this.tasks = [];
    this.users = {};

    let disposables: Rx.IDisposable[] = [];
    
    disposables.push(
      authenticationStore.authenticationInfo
        .flatMap(authInfo => usersStore.getUser(authInfo.data.username))
        .subscribe(user => this.user = user),
        
      tasksStore.tasks
        .subscribe(tasks => this.tasks = tasks),
        
      usersStore.usersByUsername
        .subscribe(users => this.users = users)
    );
      

    this.$scope.$on('$destroy', 
      () => disposables.forEach(disposable => disposable.dispose()));
  }
  
  delete(task) {
    this.tasksActions.deleteTask(task);  
  }
}
