import {Inject} from 'utils/di';

export class LoginFormComponent {

  private static selector = 'ngc-login-form';
  private static templateUrl = 
    'components/login-form/login-form-component.html';
    
  private static options = {
    bindToController: {
      errorMessage: '=',
      fireSubmit: '&onSubmit'
    }
  };

  private errorMessage: String;
  private username: String;
  private password: String;
  private fireSubmit: Function;

  constructor() {}

  private submit() {
    this.fireSubmit({
      data: this
    });
  }
}
