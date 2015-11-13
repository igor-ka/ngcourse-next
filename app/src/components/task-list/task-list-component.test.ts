import {TaskListComponent} from './task-list-component';
import {TaskActions} from '../../actions/task/task-actions';

import 'angular';
import 'angular-mocks';
import * as Rx from 'rx';


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

let _authInfoMock = {
  isAuthenticated: true,
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

    _tasksStoreMock = {
      tasks: scheduler.createHotObservable(
        Rx.ReactiveTest.onNext(200, _tasksMock))
    };
    
    _authStoreMock = {
      authenticationInfo: scheduler.createHotObservable(
        Rx.ReactiveTest.onNext(200, _authInfoMock))
    };
    
    _userStoreMock = {
      usersByUsername: scheduler.createHotObservable(
        Rx.ReactiveTest.onNext(200, _usersMock)),
      getUser: username => scheduler.createHotObservable(
        Rx.ReactiveTest.onNext(200, _usersMock['alice']))
    };

    let taskListComponent = new TaskListComponent(
      _$scope, _routerMock, _authStoreMock, 
      _tasksStoreMock, _userStoreMock, null);

    scheduler.advanceTo(220);

    chai.expect(taskListComponent.tasks).to.equal(_tasksMock);
  });

});
