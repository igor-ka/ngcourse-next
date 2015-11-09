import {ServerService, AuthenticationService} from '../../services';

export interface Task {
  _id: string,
   owner: string
   description: string
}

export class TasksService {

  static $inject = ['serverService', 'authenticationService'];

  constructor(
    private serverService: ServerService, 
    private authenticationService: AuthenticationService) { }

  getTasks = (): Promise<Task[]> => this.serverService.get('/api/v1/tasks');

  addTask = (task) => this.serverService.post('/api/v1/tasks', task);

  updateTask = (task) => this.serverService.put('/api/v1/tasks', task._id, task);

  getTask = (task) => this.serverService.get('/api/v1/tasks/', task._id);

  deleteTask = (task) => this.serverService.delete('/api/v1/tasks', task._id);
}
