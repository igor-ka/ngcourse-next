/// <reference path="../../../typings/tsd.d.ts" />
import {TasksService} from 'services/tasks/tasks-service';
import {expect} from 'chai';

export function main() {
    
  describe('TasksService', () => {

    let _tasksService;
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
    
    //beforeEach(module(($provide) => $provide.service('$q', () => Q)));
    
    beforeEach(() => { 
      
      _mockServerService = {
        get: sinon.spy(() => Q.when(_mockTasks))
      };
      
      // _mockServerService = {
      //   get: () => Q.when(_mockTasks)
      // };
      
      //_mockServerService.get.reset();
    });

    it('should get loaded', function() {
      let tasksService = new TasksService(_mockServerService);
      expect(tasksService.getTasks()).to.not.be.undefined;
    });
    
    it('should get tasks', () => {
      // Notice that we've specified that our function takes a 'done' argument.
      // This tells Mocha this is an asynchronous test. An asynchronous test will
      // not be considered 'successful' until done() is called without any
      // arguments. If we call done() with an argument the test fails, treating
      // that argument as an error.
      let tasksService = new TasksService(_mockServerService);
      
      return tasksService.getTasks()
        .then((tasks) => {
          // Assertions thrown here will result to a failed promise downstream.
          expect(tasks).to.deep.equal(_mockTasks);
          //done();
        });
        // // Remember to call done(), otherwise the test will time out (and fail).
        // .then(null, (error) => {
        //   done(error);
        // });
    });

    // it('should only call server service get once', () => {

    //   let tasksService = new TasksService(_mockServerService);

    //   return tasksService.getTasks() // Call getTasks the first time.
    //     .then(() => {
    //       return tasksService.getTasks(); // Call it again.
    //     })
    //     .then(() => {
    //       expect(_mockServerService.get.calledOnce).to.be.true; // Check the number of calls.
    //     });
    // });
  
  });
}