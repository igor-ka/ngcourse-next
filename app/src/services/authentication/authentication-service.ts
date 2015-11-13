import {ServerService} from '../../services';

const TOKEN_KEY = 'ngcourse-token';

export class AuthenticationService {
  
  constructor(
    private serverService: ServerService,
    private $window: ng.IWindowService) { }

  login(credentials) {
    return this.serverService.post('/auth/login', credentials)
      .then((response: any) => {
        this.setToken(response.data.meta.token);
        return response.data;
      });
  }

  logout() {
    this.setToken();
  }
  
  getToken() {
    return this.$window.localStorage.getItem(TOKEN_KEY);
  }

  setToken(token?: string) {
    if (token) {
      this.$window.localStorage.setItem(TOKEN_KEY, token);
    } else {
      this.$window.localStorage.removeItem(TOKEN_KEY);
    }
  }

}
