import {Inject, getServices} from 'utils/di';
import {makeAuthenticatedMethod} from 'utils/store-utils';
import {USER_ACTIONS} from 'constants/action-constants';
import {List, Map, fromJS} from 'immutable';

export class UsersStore {
  
  private _users;
  private _usersSubject;
  
  /* Authenticated methods */
  private getUsers: Function;
  
  constructor(
    @Inject('$log') private $log,
    @Inject('koast') private koast,
    @Inject('dispatcher') private dispatcher
  ) {
    this.registerActionHandlers();
    this.addAuthenticatedMethods();
    this.initialize();
  }
  
  private initialize() {
    this._users = List();
    this._usersSubject = new Rx.ReplaySubject(1);
    this.getUsers();
  }
  
  get usersSubject() {
    return this._usersSubject;
  }
  
  private registerActionHandlers() {
    this.dispatcher.filter(
      (action) => action.actionType === USER_ACTIONS.GET_USERS)
        .subscribe(() => this.getUsers());  
  }
  
  private addAuthenticatedMethods() {
    this.getUsers = makeAuthenticatedMethod(
      this.koast,
      () => Rx.Observable.fromPromise(
        this.koast.queryForResources('users'))
          .subscribe(
            (users) => {
              this._users = fromJS(users);
              this.emitChange();
            },
            (error) => this.emitError(error)
          )
      );
  }

  private emitChange() {
    this._usersSubject.onNext(this.users);
  }

  private emitError(error) {
    this._usersSubject.onError(error);
  }
  
  get users() {
    return this._users.toJS();
  }
  
  public getUserByUsername(username) {
    return this.users.filter(
      (user) => user.username === username)[0];
  }
  
  public getUserDisplayName(username) {
    return this.getUserByUsername(username).displayName;
  }
}
