import {TasksStore} from '../../stores';
import {TASK_ACTIONS} from '../../actions';

import * as Rx from 'rx';

describe('TasksStore', () => {
  
  let _scheduler;
  let _mockDispatcher;
  let _$log;
  
  let _mockTasks;
  
  beforeEach(() => {
    
    _mockTasks = [{
      _id: 2,
      owner: 'alice',
      description: 'Build the dog shed.'
    }, {
      _id: 5,
      owner: 'bob',
      description: 'Get the milk.'
    }, {
      _id: 7,
      owner: 'alice',
      description: 'Fix the door handle.'
    }];
    
    _scheduler = new Rx.TestScheduler();
  });

  it('should get a task by id', (done) => {

    _mockDispatcher = _scheduler.createColdObservable(
      Rx.ReactiveTest.onNext(10, {
        actionType: TASK_ACTIONS.GET_TASKS_RESPONSE,
        tasks: _mockTasks
      }));
    
    let tasksStore = new TasksStore(_mockDispatcher);

    tasksStore.getTaskById(5).subscribe(
      task => {
        chai.expect(task).to.not.be.undefined;
        chai.expect(task).to.deep.equal(_mockTasks[1]);
        done();
      }
    );
    
    _scheduler.advanceTo(25);

  });
});
