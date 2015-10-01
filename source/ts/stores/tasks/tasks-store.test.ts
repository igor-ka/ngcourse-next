import {TasksStore} from '../../stores/tasks/tasks-store';
import {TASK_ACTIONS} from '../../actions/action-constants';

import 'rx.testing';
import 'rx.virtualtime';

describe('TasksStore', () => {
  
  let _scheduler;
  let _mockDispatcher;
  let _mockKoast;
  let _mockServerService;
  let _$log;
  
  let _mockTasks;
  let _mockNewTask;
  
  beforeEach(() => {
    
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

    angular.mock.inject($log => _$log = $log);
    
    _mockKoast = {
      user: {
        whenAuthenticated: () => Promise.resolve(),
        data: {
          username: 'alice'
        }
      },
      queryForResources: sinon.spy(() => Promise.resolve(_mockTasks)),
      createResource: sinon.spy(() => Promise.resolve(
        _mockTasks.push(_mockNewTask)))
    };
    
    _scheduler = new Rx.TestScheduler();
  });

  it('should add a new task', (done) => {

    _mockDispatcher = _scheduler.createColdObservable(
      Rx.ReactiveTest.onNext(10, {
        actionType: TASK_ACTIONS.ADD_TASK,
        newTask: _mockNewTask
      }));
    
    let tasksStore = new TasksStore(_mockKoast, _mockDispatcher);

    tasksStore.tasksSubject.subscribe(
      tasks => {
        chai.expect(tasks).to.not.be.undefined;
        chai.expect(tasks).to.contain(_mockNewTask);
        done();
      }
    );
    
    _scheduler.advanceTo(25);

  });
});
