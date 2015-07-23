import {Inject} from 'utils/di';
import {AuthenticationStore} from 'stores/authentication/authentication-store';

export class AuthenticatorComponent {

  private static selector = 'ngc-authenticator';
  private static templateUrl = 'components/authenticator/authenticator-component.html';
  private static options = {
    transclude: true
  };
  
  private user;
  private users;
  private errorMessage;

  constructor(
    @Inject('$log') private $log,
    @Inject('authenticationStore') private authenticationStore,
    @Inject('authenticationActions') private authenticationActions,
    @Inject('usersStore') private usersStore) {

    this.users = usersStore.currentUsers;
    this.user = authenticationStore.currentUser;

    this.authenticationStore.getUserObservable
      .subscribe(
        (newUser) => this.user = newUser,
        (error) => this.errorMessage = error.data);

    this.usersStore.getUsersObservable
      .subscribe(
        (users) => this.users = users,
        (error) => this.errorMessage = error);
  }

  private login(form) {
    this.authenticationActions.login(form);
  }

  private logout() {
    this.authenticationActions.logout();
  }
}