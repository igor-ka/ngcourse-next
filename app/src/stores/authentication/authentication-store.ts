import {AUTHENTICATION_ACTIONS} from '../../actions/action-constants';

export class AuthenticationStore {

  authenticationInfo: Rx.ReplaySubject<any>;
  error: Rx.ReplaySubject<any>;

  static $inject = ['dispatcher'];

  constructor(private dispatcher: Rx.Subject<any>) {
    
    this.authenticationInfo = new Rx.ReplaySubject<any>();
    this.error = new Rx.ReplaySubject<any>();
    this.registerActionHandlers();
  }
  
  private registerActionHandlers() {
    
    this.dispatcher.filter(action => 
      action.actionType === AUTHENTICATION_ACTIONS.GET_AUTH_INFO)
        .subscribe((action) => this.authenticationInfo.onNext(
          action.authenticationInfo));

    this.dispatcher.filter(action => 
      action.actionType === AUTHENTICATION_ACTIONS.GET_AUTH_INFO_ERROR)
        .subscribe(action => this.error.onNext({
          type: action.actionType, 
          error: action.error 
        }));
  }

}
