import {Inject, getServices} from 'utils/di';

export class RouterConfig {

  $stateProvider: any;
  $urlRouterProvider: any;
  $locationProvider: any;

  // static $inject = [''];

  constructor(
    @Inject('$stateProvider') $stateProvider,
    @Inject('$urlRouterProvider') $urlRouterProvider,
    @Inject('$locationProvider') $locationProvider
  ) {

    $urlRouterProvider.otherwise('/tasks');
    $locationProvider.html5Mode(false);

    $stateProvider
      .state('tasks', {
        url: '/tasks',
        views: {
          '': {
            template: '<ngc-tasks></ngc-tasks>'
          }
        }
      })
      .state('tasks.details', {
        url: '/{_id:[0-9a-fA-F]{24}}',
        views: {
          'actionArea@tasks': {
            template: '<ngc-task-edit></ngc-task-edit>'
          }
        }
      })
      .state('tasks.add', {
        url: '/add',
        views: {
          'actionArea@tasks': {
            template: '<ngc-task-add></ngc-task-add>'
          }
        }
      })
      .state('account', {
        url: '/my-account',
        template: 'My account',
        resolve: {
          timeout: function($timeout) {
            return $timeout(function() {
              //delay
            }, 3000);
          }
        }
      });
  }
}

export class RouterService {

  $state: any;

  constructor(@Inject('$state') $state) {
    this.$state = $state;
  }

  goToAddTask() {
    this.$state.go('tasks.add');
  }

  goToTask(taskId) {
    this.$state.go('tasks.details', {
      _id: taskId
    });
  }

  goToTaskList() {
    this.$state.go('tasks', {}, {
      reload: true
    });
  }
};
