import {Inject} from 'utils/di';
import {AUTHENTICATION_ACTIONS} from 'constants/action-constants';

export class AuthenticationStore {

  private _userSubject;
  private _user;
  
  constructor(
    @Inject('$log') private $log,
    @Inject('koast') private koast,
    @Inject('dispatcher') private dispatcher
    ) {
    this.initialize();
    this.registerActionHandlers();
  }
  
  private initialize() {
    this._userSubject = new Rx.ReplaySubject(1);
    Rx.Observable.fromPromise(
      this.koast.user.whenAuthenticated())
        .subscribe(
          (data) => {
            this._user = this.koast.user;
            this.emitChange();
          },
          (error) => this.emitError(error));
  }
  
  get userSubject() {
    return this._userSubject;  
  }
  
  private registerActionHandlers() {
    this.dispatcher.filter(
      (action) => action.actionType === AUTHENTICATION_ACTIONS.LOGIN)
        .subscribe((action) => this.login(action.credentials));

    this.dispatcher.filter(
      (action) => action.actionType === AUTHENTICATION_ACTIONS.LOGOUT)
        .subscribe(() => this.logout());
  }

  private emitChange() {
    this._userSubject.onNext(this.user);
  }

  private emitError(error) {
    this._userSubject.onError(error);
  }
  
  private login(credentials) {
    Rx.Observable.fromPromise(
      this.koast.user.loginLocal(credentials))
        .subscribe(
          (data) => {
            this._user = this.koast.user;
            this.emitChange();
          },
          (error) => this.emitError(error)); 
  }

  private logout() {
    Rx.Observable.fromPromise(
      this.koast.user.logout())
        .subscribe(
          (data) => {
            this._user = this.koast.user;
            this.emitChange();
          },
          (error) => this.emitError(error));
  }
  
  get user() {
    return this._user;
  }
}
