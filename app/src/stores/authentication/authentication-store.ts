import {AUTHENTICATION_ACTIONS} from '../../actions/action-constants';

export class AuthenticationStore {

  private _authenticationInfo: Rx.ReplaySubject<any>;
  private _error: Rx.ReplaySubject<any>;

  static $inject = ['dispatcher'];

  constructor(private dispatcher: Rx.Subject<any>) {
    this._authenticationInfo = new Rx.ReplaySubject<any>();
    this._error = new Rx.ReplaySubject<any>();
    this.registerActionHandlers();
  }

  get authenticationInfo() {
    return this._authenticationInfo;
  }
  
  get error() {
    return this._error;
  }
  
  private registerActionHandlers() {
    
    this.dispatcher.filter(
      action => action.actionType === AUTHENTICATION_ACTIONS.GET_AUTH_INFO)
      .subscribe((action) => this._authenticationInfo.onNext(
        action.authenticationInfo));

    this.dispatcher.filter(
      action => action.actionType === AUTHENTICATION_ACTIONS.GET_AUTH_INFO_ERROR)
        .subscribe(action => this._error.onNext({
          type: action.actionType, 
          error: action.error 
        }));
  }

}
