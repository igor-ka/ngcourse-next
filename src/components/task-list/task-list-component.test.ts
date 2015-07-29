/// <reference path="../../../typings/tsd.d.ts" />
import {TaskListComponent} from 'components/task-list/task-list-component';
import {TaskActions} from 'actions/task/task-actions';
import {expect} from 'chai';

export function main() {

  let _$log;
  
  let taskListComponent;
  
  let _tasksMock = [{
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
    
  var _tasksStoreMock = { };  
  var _authStoreMock = { addChangeListener: () => {} };  
  var _userStoreMock = { addChangeListener: () => {} };  
  var _routerMock = { }; 
    
  describe('TaskListComponent', () => {

    beforeEach(() => { 
      inject(($log) => {
        _$log = $log;
      });

    });

    it('should get data from stores', () => {
      
      let scheduler = new Rx.TestScheduler();
        
      let tasksObservable = scheduler.createHotObservable(
        Rx.ReactiveTest.onNext(200, _tasksMock));  
      
      _tasksStoreMock = {
        addChangeListener: (observer) => {
          tasksObservable.subscribe(observer);
        }
      };
      
      taskListComponent = new TaskListComponent(
        _$log, _routerMock, _authStoreMock, 
        _tasksStoreMock, _userStoreMock, TaskActions);
      
      scheduler.advanceTo(220);
      expect(taskListComponent.tasks).to.equal(_tasksMock);
      
    });

  });
}