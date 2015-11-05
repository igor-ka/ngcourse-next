import {AuthenticationStore}
from '../../stores/authentication/authentication-store';
import {UsersStore} from '../../stores/users/users-store';
import {AuthenticationActions}
from '../../actions/authentication/authentication-actions';

export class MainComponent {

  private _user: any;
  private _displayName: String;
  private _errorMessage: String;

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

    let authSubscription =
      this.authenticationStore.userSubject.subscribe(
        user => this._user = user,
        error => this._errorMessage = error);

    let usersSubscription =
      this.usersStore.usersSubject.subscribe(
        users => this._displayName = users[this.user.data.username].displayName,
        error => this._errorMessage = error);

    this.$scope.$on('$destroy', () => {
      authSubscription.dispose();
      usersSubscription.dispose();
    });
  }

  private login(form) {
    this.authenticationActions.login(form);
  }

  private logout() {
    this.authenticationActions.logout();
  }

  get user() {
    return this._user;
  }

  get displayName() {
    return this._displayName;
  }

  get errorMessage() {
    return this._errorMessage;
  }
}
