import {TasksService} from './tasks-service';

describe('TasksService', () => {
  
  let _mockServerService;
  
  let _mockTasks = [{
    owner: 'alice',
    description: 'Build the dog shed.',
    done: true
  }, {
    owner: 'bob',
    description: 'Get the milk.',
    done: false
  }, {
    owner: 'alice',
    description: 'Fix the door handle.',
    done: true
  }];

  beforeEach(() => { 
    _mockServerService = {
      get: sinon.spy(() => Promise.resolve(_mockTasks))
    };
    _mockServerService.get.reset();
  });

  it('should get loaded', function() {
    let tasksService = new TasksService(_mockServerService, null);
    chai.expect(tasksService.getTasks()).to.not.be.undefined;
  });
  
  it('should get tasks', () => {
    let tasksService = new TasksService(_mockServerService, null);
    return tasksService.getTasks()
      .then(tasks => chai.expect(tasks).to.deep.equal(_mockTasks));
  });

  it('should only call server service get once', () => {
    let tasksService = new TasksService(_mockServerService, null);
    return tasksService.getTasks() // Call getTasks the first time.
      .then(() => tasksService.getTasks())
      .then(() => chai.expect(_mockServerService.get.calledOnce).to.be.true);
  });

});
