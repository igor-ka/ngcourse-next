import {AuthenticationStore, UsersStore}
  from '../../stores';
import {AuthenticationActions}
  from '../../actions';

export class MainComponent {

  private authenticationInfo: any;
  private displayName: String;
  private errorMessage: String;

  static selector = 'ngcMain';

  static directiveFactory: ng.IDirectiveFactory = () => {
    return {
      transclude: true,
      restrict: 'E',
      scope: {},
      controllerAs: 'ctrl',
      bindToController: true,
      controller: MainComponent,
      template: require('./main-component.html')
    };
  };

  static $inject = [
    '$scope',
    'authenticationStore',
    'authenticationActions',
    'usersStore'
  ];

  constructor(
    private $scope: angular.IScope,
    private authenticationStore: AuthenticationStore,
    private authenticationActions: AuthenticationActions,
    private usersStore: UsersStore) {

    let disposable = authenticationStore.authenticationInfo
      .subscribe(user => this.authenticationInfo = user);

    this.$scope.$on('$destroy', () => {
      disposable.dispose();
    });
  }

  private login(form) {
    this.authenticationActions.login(form);
  }

  private logout() {
    this.authenticationActions.logout();
  }
}
