import {makeAuthenticatedMethod} from '../../utils/store-utils';
import {USER_ACTIONS} from '../../actions/action-constants';
import {List, Map, fromJS} from 'immutable';

export class UsersStore {

  private _users: Map<String, any>;
  private _usersSubject: Rx.ReplaySubject<any>;
  
  /* Authenticated methods */
  private getUsers: Function;

  static $inject = [
    'koast',
    'dispatcher'
  ];

  constructor(
    private koast,
    private dispatcher: Rx.Subject<any>
  ) {
    this.registerActionHandlers();
    this.addAuthenticatedMethods();
    this.initialize();
  }

  private initialize() {
    this._users = Map<String, any>();
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
        (users: Object[]) => {
          this._users.clear();

          this._users = this._users.withMutations(mutableUsersMap => {
            users.forEach((value: any) => {
              mutableUsersMap.set(value.username, value);
            });

          });

          this.emitChange();
        },
        error => this.emitError(error))
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
}
