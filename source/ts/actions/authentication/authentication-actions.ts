import {Inject} from 'utils/di';
import {AUTHENTICATION_ACTIONS} from 'constants/action-constants';

export class AuthenticationActions {

  constructor(@Inject private dispatcher) {
    this.dispatcher = dispatcher;
  }

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
