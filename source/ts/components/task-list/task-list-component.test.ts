import {TaskListComponent} from './task-list-component';
import {TaskActions} from '../../actions/task/task-actions';

import 'angular';
import 'angular-mocks';
import 'rx.all';
import 'rx.testing';
import 'rx.virtualtime';

let _$scope;
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

let _usersMock = { 
  'alice' : {
    username: 'alice',
    displayName: 'Alice'
  },
  'bob': {
    username: 'bob',
    displayName: 'Robert'
  }
};

let _userMock = {
  data: {
    username: 'alice'
  }
};


describe('TaskListComponent', () => {

  beforeEach(() => { 
    angular.mock.inject($rootScope => {
      _$scope = $rootScope.$new();
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
      usersSubject: usersObservable
    };
    
    let taskListComponent = new TaskListComponent(
      _$scope, _routerMock, _authStoreMock, 
      _tasksStoreMock, _userStoreMock);
    
    scheduler.advanceTo(220);
    chai.expect(taskListComponent.tasks).to.equal(_tasksMock);
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
      usersSubject: usersObservable
    };
    
    let taskListComponent = new TaskListComponent(
      _$scope, _routerMock, _authStoreMock, 
      _tasksStoreMock, _userStoreMock);
    
    scheduler.advanceTo(220);
    chai.expect(taskListComponent.errorMessage).to.equal('error');
  });

});
