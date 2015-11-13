import {ServerService, AuthenticationService} from '../../services';

export interface User {
  _id: string;
  username: string;
  password: string;
  displayName: string;
}

export class UsersService {
  
  static $inject = [
    'serverService', 
    'authenticationService'
  ];

  constructor(
    private serverService: ServerService, 
    private authenticationService: AuthenticationService
  ) { }

  getUsers(): Promise<User[]> {
    return this.serverService.get('/api/v1/users');
  }

  addUser(user) { 
    return this.serverService.post('/api/v1/users', user);
  }

  updateUser (user) {
    return this.serverService.put('/api/v1/users', user._id, user);
  }

  getUser(id) {
    return this.serverService.get('/api/v1/users/', id);
  }

  deleteUser(id) {
    return this.serverService.delete('/api/v1/users', id);
  }

}
