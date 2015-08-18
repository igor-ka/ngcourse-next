/// <reference path="../../../typings/tsd.d.ts" />
import {TasksService} from 'services/tasks/tasks-service';
import {expect} from 'chai';

export function main() {
    
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
        get: sinon.spy(() => Q.when(_mockTasks))
      };
      _mockServerService.get.reset();
    });

    it('should get loaded', function() {
      let tasksService = new TasksService(_mockServerService);
      expect(tasksService.getTasks()).to.not.be.undefined;
    });
    
    it('should get tasks', () => {
      let tasksService = new TasksService(_mockServerService);
      return tasksService.getTasks()
        .then((tasks) => {
          expect(tasks).to.deep.equal(_mockTasks);
        });
    });

    it('should only call server service get once', () => {
      let tasksService = new TasksService(_mockServerService);
      return tasksService.getTasks() // Call getTasks the first time.
        .then(() => {
          return tasksService.getTasks(); // Call it again.
        })
        .then(() => {
          expect(_mockServerService.get.calledOnce).to.be.true; // Check the number of calls.
        });
    });
  
  });
}