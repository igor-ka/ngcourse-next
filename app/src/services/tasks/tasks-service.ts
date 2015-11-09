import {ServerService} from '../../services/server/server-service';

export class TasksService {

  private tasksPromise: Promise<any>;

  static $inject = ['serverService'];

  constructor(private serverService: ServerService) { }

  public getTasks() {
    this.tasksPromise = this.tasksPromise ||
    this.serverService.get('/api/v1/tasks');
    return this.tasksPromise;
  };
}
