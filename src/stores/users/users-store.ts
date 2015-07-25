/// <reference path="../../../typings/tsd.d.ts" />
import {Inject, getServices} from 'utils/di';
import {USER_ACTIONS} from 'constants/action-constants';
import {List, Map, fromJS} from 'immutable';
import 'rx';

export class UsersStore {
  
  private usersByUsername;
  private usersObservable;
  
  /* Authenticated methods */
  private getUsers: Function;
  
  constructor(
    @Inject('$log') private $log,
    @Inject('koast') private koast,
    @Inject('dispatcher') private dispatcher
  ) {
    this.addAuthenticatedMethods();
    this.setInitialState();
    this.registerActionHandlers();
  }
  
  get getUsersObservable() {
    return this.usersObservable;
  }
  
  get currentUsers() {
    return this.usersByUsername.toJS();
  }
  
  public getUserByUsername(username) {
    return this.usersByUsername.get(username);
  }
  
  private setInitialState() {
    this.usersByUsername = Map();
    this.usersObservable = new Rx.Subject();
    this.getUsers();
  }
  
  private registerActionHandlers() {
    this.dispatcher.filter(
      (action) => action.actionType === USER_ACTIONS.GET_USERS)
        .subscribe(() => this.getUsers());  
  }
  
  private addAuthenticatedMethods() {
    this.getUsers = this.makeAuthenticatedMethod(
      () => Rx.Observable.fromPromise(
        this.koast.queryForResources('users'))
          .subscribe(
            (users: Array<{username: string}>) => {
              this.usersByUsername = Map().withMutations(
                (map) => {
                  users.forEach(
                    (user) => map.set(user.username, user));
                });
                this.usersObservable.onNext(this.usersByUsername.toJS());
            },
            (error) => this.usersObservable.onError(error)
          )
      );
  }
  
  private makeAuthenticatedMethod(method) {
    return function () {
      let methodArgs = arguments;
      return this.koast.user.whenAuthenticated()
        .then(() => method.apply(this, methodArgs));
    };
  }
}
