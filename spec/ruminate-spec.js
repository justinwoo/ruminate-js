/* @flow */
import Rx from 'rx';
import Ruminate from '../src/index';

describe('Ruminate', () => {
  it('will get values from init', (done) => {
    new Ruminate(
      {
        some: Rx.Observable.from([1,2,3]),
        backtothedriver: Rx.Observable.empty()
      },
      (sources) => ({
          some: Rx.Observable.empty(),
          backtothedriver: sources.backtothemain
      }),
      (inputs) => {
        let count = 0;
        inputs.backtothedriver.subscribe(x => {
          count++;
          expect(x).toBe(count * 2);
          if (count === 3) {
            done();
          }
        });

        return {
          backtothemain: inputs.some.map(x => x * 2)
        }
      }
    );
  });
  it('will get values from sink', (done) => {
    new Ruminate(
      {
        some: Rx.Observable.empty()
      },
      () => ({
        some: Rx.Observable.from([1,2,3]),
      }),
      (inputs) => {
        let count = 0;
        inputs.some.subscribe(x => {
          count++;
          expect(x).toBe(count);
          if (count === 3) {
            done();
          }
        });
        return {};
      }
    );
  });
  it('will get values from both', (done) => {
    new Ruminate(
      {
        some: Rx.Observable.from([1,2,3])
      },
      () => ({
        some: Rx.Observable.from([4,5,6]),
      }),
      (inputs) => {
        let count = 0;
        inputs.some.subscribe(x => {
          count++;
          if (count === 6) {
            done();
          }
        });
        return {};
      }
    );
  });
  it('will cycle driver output', (done) => {
    new Ruminate(
      {
        some: Rx.Observable.from([1,2,3]),
        funneled: Rx.Observable.empty()
      },
      ({transformed}) => ({
        some: Rx.Observable.from([4,5,6]),
        funneled: transformed
      }),
      (inputs) => {
        let count = 0;
        inputs.funneled.subscribe(x => {
          count++;
          if (count === 18) {
            done();
          }
        });
        return {
          transformed: inputs.some.flatMap(x => Rx.Observable.from([x,x,x]))
        };
      }
    );
  });
});
