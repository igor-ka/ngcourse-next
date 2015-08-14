import {Inject} from 'utils/di';
import {AuthenticationStore} from 'stores/authentication/authentication-store';

export class MainComponent {

  private static selector = 'ngc-main';
  private static templateUrl = 'components/main/main-component.html';
  private static options = {
    transclude: true
  };
  
  private _user;
  private _displayName;
  private _errorMessage;

  constructor(
    @Inject('$log') private $log,
    @Inject('authenticationStore') private authenticationStore,
    @Inject('authenticationActions') private authenticationActions,
    @Inject('usersStore') private usersStore) {
    
    this.authenticationStore.userSubject.subscribe(
      Rx.Observer.create(
        (user) => this._user = user,
        (error) => this._errorMessage = error
      ));    

    this.usersStore.usersSubject.subscribe(
      Rx.Observer.create(
        () => this._displayName = this.usersStore
          .getUserDisplayName(this.user.data.username),
        (error) => this._errorMessage = error
      ));
  }

  private login(form) {
    this.authenticationActions.login(form);
  }

  private logout() {
    this.authenticationActions.logout();
  }
  
  private getDisplayName() {
    this.usersStore.getUserDisplayName(
      this.user.data.username);
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