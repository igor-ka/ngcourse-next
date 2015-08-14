/// <reference path="../../../typings/tsd.d.ts"/>
// import {UsersStore} from 'stores/users/users-store';
// import {expect} from 'chai';
// import 'mocha';
// import 'sinon';

// export function main() {
//   describe('LoginFormComponent', () => {
//     it('should exits', () => {
//       expect(UsersStore).to.be.a('function');
//     });

//     it('should use our mocks', () => {

//       let logMock = {};
//       let whenAuthenticatedCalledCount = 0;
//       let koastMock = {
//         user: {
//           whenAuthenticated: () => {
//             whenAuthenticatedCalledCount++;
//             return Promise.resolve();
//           }
//         }
//       };
//       let us = new UsersStore(logMock, koastMock, null);
//       expect(us).to.be.an('object');
//       //expect(us.whenReady).to.be.a('function');
//       expect(whenAuthenticatedCalledCount).to.be.above(
//         0, 'it should call koast.user.whenAuthenicated when the service was init\'d');
//     });
//   });
// }