export class LoginFormComponent {


  private errorMessage: String;
  private username: String;
  private password: String;
  private fireSubmit: Function;

  static selector = 'ngcLoginForm';

  static directiveFactory: ng.IDirectiveFactory = () => {
    return {
      transclude: true,
      restrict: 'E',
      scope: {},
      controllerAs: 'ctrl',
      bindToController: {
        errorMessage: '=',
        fireSubmit: '&onSubmit'
      },
      controller: LoginFormComponent,
      template: require('./login-form-component.html')
    };
  };

  constructor() {
  }

  private submit() {
    this.fireSubmit({
      data: this
    });
  }
}
