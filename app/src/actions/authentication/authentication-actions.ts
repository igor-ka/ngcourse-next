import {AUTHENTICATION_ACTIONS} from '../action-constants';

export class AuthenticationActions {

  static $inject = ['dispatcher'];
  
  constructor(
    private dispatcher: Rx.Subject<any>) { }

  login(credentials) {
    this.dispatcher.onNext({
      actionType: AUTHENTICATION_ACTIONS.LOGIN,
      credentials: credentials
    });
  }

  logout() {
    this.dispatcher.onNext({
      actionType: AUTHENTICATION_ACTIONS.LOGOUT
    });
  }

}
