/// <reference path="../../../typings/tsd.d.ts" />
import {Inject} from 'utils/di';
import {AUTHENTICATION_ACTIONS} from 'constants/action-constants';
import {List} from 'immutable';
import 'rx';

export class AuthenticationStore {

  private userObservable;
  private user;
  
  constructor(
    @Inject('$log') private $log,
    @Inject('koast') private koast,
    @Inject('usersStore') private usersStore,
    @Inject('dispatcher') private dispatcher
    ) {
    this.setInitialState();
    this.registerActionHandlers();
  }
  
  get getUserObservable() {
    return this.userObservable;
  }
  
  get currentUser() {
    return this.user;  
  }
  
  private setInitialState() {
    this.userObservable = new Rx.Subject();
    Rx.Observable.fromPromise(
      this.koast.user.whenAuthenticated())
        .subscribe(
          (data) => {
            this.user = this.koast.user;
            this.userObservable.onNext(this.user);
          },
          (error) => this.userObservable.onError(error));
  }
  
  private registerActionHandlers() {
    this.dispatcher.filter(
      (action) => action.actionType === AUTHENTICATION_ACTIONS.LOGIN)
        .subscribe((action) => this.login(action.credentials));

    this.dispatcher.filter(
      (action) => action.actionType === AUTHENTICATION_ACTIONS.LOGOUT)
        .subscribe(() => this.logout());
  }
  
  private login(credentials) {
    Rx.Observable.fromPromise(
      this.koast.user.loginLocal(credentials))
        .subscribe(
          (data) => {
            this.user = this.koast.user;
            this.userObservable.onNext(this.user);
          },
          (error) => this.userObservable.onError(error)); 
  }

  private logout() {
    Rx.Observable.fromPromise(
      this.koast.user.logout())
        .subscribe(
          data => this.userObservable.onNext(this.koast.user),
          error => this.userObservable.onError(error));
  }
}
