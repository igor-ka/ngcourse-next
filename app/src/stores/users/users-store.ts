import {USER_ACTIONS} from '../../actions/action-constants';
import {User} from '../../services';
import * as Rx from 'rx';

export class UsersStore {

  private _users: Rx.ReplaySubject<User[]>;
  private _error: Rx.ReplaySubject<any>;

  static $inject = [
    'koast',
    'dispatcher'
  ];

  constructor(
    private koast,
    private dispatcher: Rx.Subject<any>
  ) {
    this._users = new Rx.ReplaySubject<User[]>(1);
    this._error = new Rx.ReplaySubject(1);
    
    this.registerActionHandlers();
  }
  
  get users() {
    return this._users;
  }
  
  get error() {
    return this._error;
  }
  
  private registerActionHandlers() {
        
    this.dispatcher.filter(
      action => action.actionType === USER_ACTIONS.GET_USERS_RESPONSE)
      .subscribe(action => this._users.onNext(action.users));
      
    this.dispatcher.filter(
      action => action.actionType === USER_ACTIONS.GET_USERS_RESPONSE_ERROR)
      .subscribe(action => this._users.onError({
        type: action.actionType, 
        error: action.error 
      }));
  }
  
  getUser(username: string) {
    return this._users
      .flatMap(users => Rx.Observable.from(users))
      .filter(user => user.username === username);
  }
  
  get usersByUsername() {
    return this.users
      .flatMap(users => Rx.Observable.from(users))
      .scan((map, user) => {
        map[user.username] = user;
        return map;
      });
      
    // return this.users.map(users => {
    //   let usersByUsername = {}
    //   users.forEach(user => usersByUsername[user.username] = user);
    //   return usersByUsername;
    // });

  }
}
