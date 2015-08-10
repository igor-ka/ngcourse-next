/// <reference path="../../../typings/tsd.d.ts" />
import {TaskListComponent} from 'components/task-list/task-list-component';
import {TaskActions} from 'actions/task/task-actions';
import {expect} from 'chai';

export function main() {

  let _$log;
  
  let _tasksStoreMock;  
  let _authStoreMock;  
  let _userStoreMock;  
  let _routerMock;
  
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
  
  let _usersMock = [{
      username: 'alice',
      displayName: 'Alice'
    },
    {
      username: 'bob',
      displayName: 'Robert'
    }];
  
  let _userMock = {
    data: {
      username: 'alice'
    }
  };
    
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
      
      let userObservable = scheduler.createHotObservable(
        Rx.ReactiveTest.onNext(200, _userMock));  
        
      let usersObservable = scheduler.createHotObservable(
        Rx.ReactiveTest.onNext(200, _usersMock));    
      
      _tasksStoreMock = {
        tasksSubject: tasksObservable
      };
      
      _authStoreMock = {
        userSubject: userObservable
      };
      
      _userStoreMock = {
        usersSubject: usersObservable,
        getUserDisplayName: (username) => {
          _usersMock.filter(
            (user) => user.username === username)[0];
        }
      };
      
      let taskListComponent = new TaskListComponent(
        _$log, _routerMock, _authStoreMock, 
        _tasksStoreMock, _userStoreMock, TaskActions);
      
      scheduler.advanceTo(220);
      expect(taskListComponent.tasks).to.equal(_tasksMock);
    });
    
    it('should get error from stores', () => {
      
      let scheduler = new Rx.TestScheduler();
        
      let tasksObservable = scheduler.createHotObservable(
        Rx.ReactiveTest.onError(200, 'error'));
      
      let userObservable = scheduler.createHotObservable(
        Rx.ReactiveTest.onNext(200, _userMock));  
        
      let usersObservable = scheduler.createHotObservable(
        Rx.ReactiveTest.onNext(200, _usersMock));    
      
      _tasksStoreMock = {
        tasksSubject: tasksObservable
      };
      
      _authStoreMock = {
        userSubject: userObservable
      };
      
      _userStoreMock = {
        usersSubject: usersObservable,
        getUserDisplayName: (username) => {
          _usersMock.filter(
            (user) => user.username === username)[0];
        }
      };
      
      let taskListComponent = new TaskListComponent(
        _$log, _routerMock, _authStoreMock, 
        _tasksStoreMock, _userStoreMock, TaskActions);
      
      scheduler.advanceTo(220);
      expect(taskListComponent.errorMessage).to.equal('error');
    });

  });
}