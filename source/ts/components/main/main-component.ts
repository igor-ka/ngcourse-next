import {Inject} from '../../utils/di';
import {AuthenticationStore} 
  from '../../stores/authentication/authentication-store';
import {UsersStore} from '../../stores/users/users-store';
import {AuthenticationActions} 
  from '../../actions/authentication/authentication-actions';

export class MainComponent {

  private static selector = 'ngc-main';
  private static templateUrl = 'components/main/main-component.html';
  private static options = {
    transclude: true
  };
  
  private _user: any;
  private _displayName: String;
  private _errorMessage: String;

  constructor(
    @Inject('$scope') 
      private $scope: angular.IScope,
    @Inject('authenticationStore') 
      private authenticationStore: AuthenticationStore,
    @Inject('authenticationActions') 
      private authenticationActions: AuthenticationActions,
    @Inject('usersStore') 
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
