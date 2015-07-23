/// <reference path="../../../typings/tsd.d.ts" />
import {Inject} from 'utils/di';
import {USER_ACTIONS, } from 'constants/action-constants';

export class UserActions {

  constructor(@Inject private dispatcher) {
    this.dispatcher = dispatcher;
  }

  getUsers() {
    this.dispatcher.onNext({
      actionType: USER_ACTIONS.GET_USERS
    });
  }
  
  // addTask(newTask) {
  //   this.dispatcher.onNext({
  //     actionType: USER_ACTIONS.ADD_TASK,
  //     newTask: newTask
  //   });
  // }
  
  // getCurrentUser() {
  //   this.dispatcher.onNext({
  //     actionType: USER_ACTIONS.GET_CURRENT_USER
  //   });
  // }
}
