/// <reference path="../../../typings/tsd.d.ts"/>
import {TasksStore} from 'stores/tasks/tasks-store';
import {TASK_ACTIONS} from 'constants/action-constants';
import {TaskActions} from 'actions/task/task-actions';
import {getService} from 'utils/test-utils';
import {expect} from 'chai';
//import {Rx} from 'rx';

export function main() {
  
  describe('TasksStore', () => {
    
    let _scheduler;
    let _mockDispatcher;
    let _mockKoast;
    let _mockServerService;
    let _$log;
    
    let _mockTasks;
    let _mockNewTask;
    
    beforeEach(() => {
      // _mockKoast = {
      //   user: {
      //     whenAuthenticated: () => Q.when(),
      //     data: {
      //       username: 'alice'
      //     }
      //   },
      //   queryForResources: sinon.spy(() => Q.when(_mockTasks))
      // };
      
      _mockTasks = [{
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
      
      _mockNewTask = {
        owner: 'alice',
        description: 'Kill Bill.',
        done: false
      };
      
      _mockServerService = {
        get: () => Q.when(_mockTasks),
        post: (newTask) => Q.when(_mockTasks.push(_mockNewTask))
      };
      
      inject(($log) => _$log = $log);
      
      _scheduler = new Rx.TestScheduler();
    });

    it('should add a new task', (done) => {

      _mockDispatcher = _scheduler.createColdObservable(
        Rx.ReactiveTest.onNext(10, {
          actionType: TASK_ACTIONS.ADD_TASK,
          newTask: _mockNewTask
        }));
      
      let tasksStore = new TasksStore(_$log, _mockServerService, _mockDispatcher);

      tasksStore.tasksSubject
        .observeOn(Rx.Scheduler.timeout)
        .subscribe(
          (tasks) => {
          
          console.log('tasks: ', tasks);
          expect(tasks).to.not.be.undefined;
          expect(tasks).to.contain(_mockNewTask);
          
          done();

        }
      );
      
      _scheduler.advanceTo(25);
      
    });
  });
}