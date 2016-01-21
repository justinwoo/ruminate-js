/* @flow */
import Rx from 'rx';

export default class Ruminate<T: Object, R: Object> {
  compositeDisposable: Rx.CompositeDisposable;

  constructor(init: T, main: (sources: R) => T, drivers: (inputs: T) => R) {
    const inputProxies = this.makeInputProxies(init);
    const sources = this.runDrivers(drivers, init, inputProxies);
    const sink = main(sources);
    this.compositeDisposable = this.mapSinkToProxies(sink, inputProxies);
  }

  dispose(): void {
    this.compositeDisposable.dispose();
  }

  makeInputProxies(init: T): T {
    let inputProxies = Object.assign({}, init);
    for (const key in inputProxies) {
      if (inputProxies.hasOwnProperty(key)) {
        const inputProxy = new Rx.Subject();
        inputProxies[key] = inputProxy;
      }
    }
    return inputProxies;
  }

  runDrivers(drivers: (inputs: T) => R, init: T, inputProxies: T): R {
    let driverInput = Object.assign({}, init);
    for (const key in driverInput) {
      if (driverInput.hasOwnProperty(key)) {
        driverInput[key] = Rx.Observable.merge(init[key], inputProxies[key]);
      }
    }
    return drivers(driverInput);
  }

  mapSinkToProxies(sink: T, inputProxies: T): Rx.CompositeDisposable {
    const compositeDisposable = new Rx.CompositeDisposable();
    for (const key in sink) {
      if (sink.hasOwnProperty(key) && inputProxies.hasOwnProperty(key)) {
        const proxy = inputProxies[key];
        const subscription = sink[key].subscribe(proxy.asObserver());
        const disposable = Rx.Disposable.create(() => subscription.dispose());

        compositeDisposable.add(disposable);
      }
    }
    return compositeDisposable;
  }
}
