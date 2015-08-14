import {Inject} from 'utils/di';

export class TasksService {

  private tasksPromise;
  
  constructor(@Inject('serverService') private serverService) { }

  public getTasks () {
    this.tasksPromise = this.tasksPromise || this.serverService.get('/api/v1/tasks');
    return this.tasksPromise;
  };
}