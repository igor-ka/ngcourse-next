import {USER_ACTIONS} from '../../actions/action-constants';
import {User} from '../../services';
import * as Rx from 'rx';

export class UsersStore {

  private users: Rx.ReplaySubject<User[]>;
  private error: Rx.ReplaySubject<any>;

  static $inject = [
    'dispatcher'
  ];

  constructor(private dispatcher: Rx.Subject<any>) {
    this.users = new Rx.ReplaySubject<User[]>(1);
    this.error = new Rx.ReplaySubject(1);

    this.registerActionHandlers();
  }

  private registerActionHandlers() {

    this.dispatcher.filter(
      action => action.actionType === USER_ACTIONS.GET_USERS_RESPONSE)
      .subscribe(action => this.users.onNext(action.users));

    this.dispatcher.filter(
      action => action.actionType === USER_ACTIONS.GET_USERS_RESPONSE_ERROR)
      .subscribe(action => this.users.onError({
        type: action.actionType,
        error: action.error
      }));
  }

  getUser(username: string) {
    return this.users
      .map(users => users.find(user => user.username === username));
  }

  get usersByUsername() {
    return this.users
      .map(users => users.reduce((userMap, user) => {
          userMap[user.username] = user;
          return userMap;
        }, {}));
  }
}
