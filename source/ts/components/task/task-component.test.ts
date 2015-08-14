import {makeDirective, makeSelector} from 'utils/component-utils';
import {TaskComponent} from 'components/task/task-component';

import 'angular';
import 'angular-mocks';
import 'template-cache';

// import 'chai';
// import 'mocha';
    
describe('TaskComponent', () => {

  let _$scope;
  let _$compile;

  angular.module('tasks', ['ngcourse.templates'])
    .directive(
      makeSelector(TaskComponent), 
      makeDirective(TaskComponent));
        
  beforeEach(() => angular.mock.module('tasks')); 
  beforeEach(() => { 
    angular.mock.inject(($compile, $rootScope) => {
      _$scope = $rootScope.$new();
      _$compile = $compile;
    });

  });

  it('generate the approprate HTML', () => {
    
    _$scope.task = {
      owner: 'alice',
      description: 'Fix the door handle.',
      done: true
    };
    
    _$scope.user = {
      displayName: 'Alice'
    };
    
    let element = angular.element(
      `<ngc-task
        task="task" 
        user="user">
      </ngc-task>`);
      
    let compiled = _$compile(element)(_$scope);
  
    _$scope.$digest();
    
    chai.expect(compiled.html()).to.contain('Fix the door handle.');
  
  });

});
