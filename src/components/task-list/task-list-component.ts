/// <reference path="../../../typings/tsd.d.ts" />
import {Inject} from 'utils/di';
// import {AuthenticationStore} from 'stores/authentication/authentication-store';
// import {UsersStore} from 'stores/users/users-store';
// import {TasksStore} from 'stores/tasks/tasks-store';
//import 'rx';

export class TaskListComponent {

  private static selector = 'ngc-tasks';
  private static templateUrl = 'components/task-list/task-list-component.html';
  private static options = {};

  private tasks;
  private users;
  private user;
  private errorMessage;

  constructor(
    @Inject('$log') private $log,
    @Inject('router') private router,
    @Inject('authenticationStore') private authenticationStore,
    @Inject('tasksStore') private tasksStore,
    @Inject('usersStore') private usersStore,
    @Inject('tasksActions') private tasksActions
    ) {

      this.tasks = tasksStore.currentTasks;
      this.users = usersStore.currentUsers;
      this.user = authenticationStore.currentUser;

      this.authenticationStore.getUserObservable
        .subscribe(
          (user) => this.user = user,
          (error) => this.errorMessage = error
        );

      this.tasksStore.getTasksObservable
        .subscribe(
          (tasks) => this.tasks = tasks,
          (error) => this.errorMessage = error
        );

      this.usersStore.getUsersObservable
        .subscribe(
          (users) => this.users = users,
          (error) => this.errorMessage = error
        );
  }

  private addTask(task) {
    this.tasksActions.addTask(task);
    this.router.goToTaskList();  
  }

  private goToAddTask() {
    this.router.goToAddTask.bind(this.router);
  }
};

