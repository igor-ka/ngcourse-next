import {AUTHENTICATION_ACTIONS} from '../action-constants';
import {AuthenticationService} from '../../services';

export class AuthenticationActions {

  static $inject = [
    'dispatcher',
    'authenticationService'];

  constructor(
    private dispatcher: Rx.Subject<any>,
    private authService: AuthenticationService) { }

  // getAuthInfo() {
  //   this.authService.getAuthInfo()
  //     .then(authInfo => this.dispatcher.onNext({
  //       actionType: AUTHENTICATION_ACTIONS.GET_AUTH_INFO,
  //       authenticationInfo: authInfo
  //     }))
  //     .then(null, error => this.dispatcher.onNext({
  //       actionType: AUTHENTICATION_ACTIONS.GET_AUTH_INFO_ERROR,
  //       error: error
  //     }));
  // }

  login(credentials) {
    this.authService.login(credentials)
      .then(authInfo => {
        debugger;
        this.dispatcher.onNext({
          actionType: AUTHENTICATION_ACTIONS.GET_AUTH_INFO,
          authenticationInfo: authInfo
        })
      })
      .then(null, error => this.dispatcher.onNext({
        actionType: AUTHENTICATION_ACTIONS.GET_AUTH_INFO_ERROR,
        error: error
      }));
  }

  logout() {
    this.authService.logout();
  }

}
