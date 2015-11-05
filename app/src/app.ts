import 'angular-ui-router';
import 'lodash-compat';
import 'koast-angular';

import 'basscss/css/basscss.css';
import 'font-awesome/css/font-awesome.css';
import '../css/styles.css';

import * as angular from 'angular';
import * as Rx from 'rx';

import {
  ServerService, 
  RouterService, 
  RouterConfig
} from './services/index';

import {
  TasksStore, 
  UsersStore, 
  AuthenticationStore
} from './stores/index';

import {
  LoginFormComponent,
  TaskListComponent,
  TaskComponent,
  TaskAddComponent,
  TaskEditComponent,
  MainComponent
} from './components/index';

import {
  TaskActions, 
  UserActions, 
  AuthenticationActions
} from './actions/index';


angular.module('ngcourse.router', ['ui.router'])
  .config(RouterConfig)
  .service('router', RouterService);

angular.module('ngcourse.authentication', [])
  .service('authenticationStore', AuthenticationStore)
  .service('authenticationActions', AuthenticationActions)
  .directive(
  LoginFormComponent.selector,
  LoginFormComponent.directiveFactory);

angular.module('ngcourse.tasks', [])
  .service('tasksStore', TasksStore)
  .service('tasksActions', TaskActions)
  .directive(
    TaskListComponent.selector,
    TaskListComponent.directiveFactory)
  .directive(
    TaskComponent.selector,
    TaskComponent.directiveFactory)
  .directive(
    TaskAddComponent.selector,
    TaskAddComponent.directiveFactory)
  .directive(
    TaskEditComponent.selector,
    TaskEditComponent.directiveFactory);

angular.module('ngcourse.users', [])
  .service('usersStore', UsersStore)
  .service('usersActions', UserActions);

angular.module('ngcourse.server', [])
  .service('server', ServerService);

angular.module('ngcourse.dispatcher', [])
  .service('dispatcher', Rx.Subject);

angular.module('ngcourse', [
  'ngcourse.authentication',
  'ngcourse.tasks',
  'ngcourse.users',
  'ngcourse.server',
  'ngcourse.router',
  'ngcourse.dispatcher',
  'koast'])
  .directive(
    MainComponent.selector,
    MainComponent.directiveFactory)
  .constant('API_BASE_URL', 'http://ngcourse.herokuapp.com')
  .run((koast, API_BASE_URL) => {
    koast.init({
      baseUrl: API_BASE_URL
    });
    koast.setApiUriPrefix('/api/v2/');
    koast.addEndpoint('tasks', ':_id', {
      useEnvelope: true
    });
    koast.addEndpoint('users', ':_id', {
      useEnvelope: true
    });
  });

angular.element(document).ready(function() {
  angular.bootstrap(document, ['ngcourse']);
});
