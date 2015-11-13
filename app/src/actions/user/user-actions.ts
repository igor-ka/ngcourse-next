import {USER_ACTIONS} from '../action-constants';
import {UsersService} from '../../services';
import * as Rx from 'rx';

export class UserActions {

  static $inject = [
    'dispatcher',
    'usersService'
  ];

  constructor(
    private dispatcher: Rx.Subject<any>,
    private usersService: UsersService) { }

  getUsers() {
    this.usersService.getUsers()
      .then(users => this.dispatcher.onNext({
        actionType: USER_ACTIONS.GET_USERS_RESPONSE,
        users: users
      }))
      .then(null, error => this.dispatcher.onNext({
        actionType: USER_ACTIONS.GET_USERS_RESPONSE_ERROR,
        error: error
      }));
  }
}
