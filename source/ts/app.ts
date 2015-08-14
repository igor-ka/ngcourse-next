import 'angular';
import 'angular-ui-router';
import 'immutable';
import 'koast-angular';
import 'lodash';
import 'rx';
import 'template-cache';

import {TasksStore} from 'stores/tasks/tasks-store';
import {UsersStore} from 'stores/users/users-store';
import {AuthenticationStore} from 'stores/authentication/authentication-store';
import {ServerService} from 'services/server/server-service';
import {RouterService, RouterConfig} from 'services/router/router-service';
import {TaskListComponent} from 'components/task-list/task-list-component';
import {TaskAddComponent} from 'components/task-add/task-add-component';
import {TaskEditComponent} from 'components/task-edit/task-edit-component';
import {TaskComponent} from 'components/task/task-component';
import {MainComponent} from 'components/main/main-component';
import {LoginFormComponent} from 'components/login-form/login-form-component';
import {TaskActions} from 'actions/task/task-actions';
import {UserActions} from 'actions/user/user-actions';
import {AuthenticationActions} from 'actions/authentication/authentication-actions';
import {makeDirective, makeSelector} from 'utils/component-utils';

angular.module('ngcourse.router', ['ui.router'])
  .config(RouterConfig)
  .service('router', RouterService);

angular.module('ngcourse.authentication', [])
  .service('authenticationStore', AuthenticationStore)
  .service('authenticationActions', AuthenticationActions);
  
angular.module('ngcourse.tasks', [])
  .service('tasksStore', TasksStore)
  .service('tasksActions', TaskActions);
  
angular.module('ngcourse.users', [])
  .service('usersStore', UsersStore)
  .service('usersActions', UserActions);

angular.module('ngcourse.server', [])
  .service('server', ServerService);
  
angular.module('ngcourse.dispatcher', [])
  .service('dispatcher', Rx.Subject);

angular.module('ngcourse', [
  'ngcourse.templates',
  'ngcourse.authentication',
  'ngcourse.tasks',
  'ngcourse.users',
  'ngcourse.server',
  'ngcourse.router',
  'ngcourse.dispatcher',
  'koast'])
  
  .directive(
    makeSelector(MainComponent), 
    makeDirective(MainComponent))
  .directive(
    makeSelector(LoginFormComponent), 
    makeDirective(LoginFormComponent))
  .directive(
    makeSelector(TaskListComponent), 
    makeDirective(TaskListComponent))
  .directive(
    makeSelector(TaskComponent), 
    makeDirective(TaskComponent))
  .directive(
    makeSelector(TaskAddComponent), 
    makeDirective(TaskAddComponent))
  .directive(
    makeSelector(TaskEditComponent), 
    makeDirective(TaskEditComponent))
  
  .constant('API_BASE_URL', 'http://ngcourse.herokuapp.com')
  .run(function ($log: angular.ILogService, koast, API_BASE_URL) {
    $log.info('All ready!');
  
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