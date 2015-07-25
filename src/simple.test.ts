/// <reference path="../typings/tsd.d.ts"/>
import {expect} from 'chai';

export function main() {
  describe('Simple Test', () => {
    it('2*2 should equal 4', () => {
      let x = 2 * 2;
      let y = 4;
      // Assert that x is defined.
      expect(x).to.not.be.undefined;
      // Assert that x equals to specific value.
      expect(x).to.equal(4);
      // Assert that x equals to y.
      expect(x).to.equal(y);
      // See http://chaijs.com/api/bdd/ for more assertion options.
    });
  });
}