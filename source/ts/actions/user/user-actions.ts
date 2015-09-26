import {Inject} from '../../utils/di';
import {USER_ACTIONS, } from '../action-constants';

export class UserActions {

  constructor(
    @Inject('dispatcher') 
      private dispatcher: Rx.Subject<any>) {}

  getUsers() {
    this.dispatcher.onNext({
      actionType: USER_ACTIONS.GET_USERS
    });
  }

}
