import {ServerService, AuthenticationService} from '../../services';

export interface User {
  _id: string,
  username: string,
  password: string,
  displayName: string
}

export class UsersService {

  private usersPromise: Promise<any>;

  static $inject = ['serverService', 'authenticationService'];

  constructor(
    private serverService: ServerService, 
    private authenticationService: AuthenticationService) { }

  getUsers = (): Promise<User[]> => this.serverService.get('/api/v1/users');

  addUser = (user) => this.serverService.post('/api/v1/users', user);

  updateUser = (user) => this.serverService.put('/api/v1/users', user._id, user);

  getUser = (id) => this.serverService.get('/api/v1/users/', id);

  deleteUser = (id) => this.serverService.delete('/api/v1/users', id);

}
