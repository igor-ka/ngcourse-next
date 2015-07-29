/// <reference path="../../../typings/tsd.d.ts"/>
import {TasksStore} from 'stores/tasks/tasks-store';
import {TASK_ACTIONS} from 'constants/action-constants';
import {TaskActions} from 'actions/task/task-actions';
import {getService} from 'utils/test-utils';
import {expect} from 'chai';

export function main() {

  let mockTasks = [{
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
  
  let scheduler;
  
  let mockDispatcher;
  
  let doneFn;
   
  angular.module('ngcourse.tasks', [])
    .service('tasksStore', TasksStore)
    .service('tasksActions', TaskActions);
  
  describe('TasksStore', () => {
    
    beforeEach(module('ngcourse.tasks')); 
    beforeEach(module(($provide) => {
      $provide.service('koast', () =>
        ({
          user: {
            whenAuthenticated: () => Q.when(),
            data: {
              username: 'alice'
            }
          },
          queryForResources: sinon.spy(() => Q.when(mockTasks))
        })
      );
      $provide.service('dispatcher', () => mockDispatcher);
      $provide.service('$q', () => Q);
    }));

    it('should use our mocks', function(done) {
      
      let scheduler = new Rx.TestScheduler();

      mockDispatcher = scheduler.createHotObservable(
        Rx.ReactiveTest.onNext(200, {
          actionType: TASK_ACTIONS.GET_TASKS
        }));
        
      let tasksStore = getService('tasksStore');
      expect(tasksStore).to.be.an('object', 'it should be an object');
      
      scheduler.advanceTo(250);
      
      var source: Rx.Subject<Object> = tasksStore.subject;
      
      source.observeOn(Rx.Scheduler.timeout).subscribe(
        function (tasks) {
          
          expect(tasks).to.not.be.undefined;
          expect(tasks).to.deep.equal(mockTasks);
          
          done();
        }
      );
      
    });
  });


}