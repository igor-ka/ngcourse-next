import {USER_ACTIONS} from '../action-constants';
import * as Rx from 'rx';

export class UserActions {

  static $inject = ['dispatcher'];

  constructor(private dispatcher: Rx.Subject<any>) { }

  getUsers() {
    this.dispatcher.onNext({
      actionType: USER_ACTIONS.GET_USERS
    });
  }

}
