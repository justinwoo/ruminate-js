import Rx from 'rx';

interface rx$ArrayLike<T> {
  length: number;
  [index: number]: T;
}

class rx$Observer<T> {
  asObserver: () => rx$Observer<T>;
  onNext: (item: T) => void;
  onError: (err: any) => void;
  onCompleted: () => void;
}

type rx$Subscription = Rx.Disposable & {
  unsubscribe: () => void;
}

type rx$DisposeFunction = () => void;

declare module 'rx' {

  declare class Observable<T> {
    static empty(): Observable<T>;
    static from(array: T[] | rx$ArrayLike<T>): Observable<T>;
    static merge<R>(...sources: Observable<R>[]): Observable<R>;
    static create(constructor: ((observer: rx$Observer<T>) => rx$DisposeFunction)): Observable<T>;

    do(f: (item: T) => any): Observable<T>;
    flatMap<R>(f: (item: T) => Observable<R>): Observable<R>;
    map<R>(f: (item: T) => R): Observable<R>;
    scan<R>(f: (prev: R, next: T) => R): Observable<R>;
    skip(count: number): Observable<T>;
    startWith(init: any): Observable<T>;
    take(count: number): Observable<T>;

    subscribe(
      onNextOrSubject?: ((item: T) => any) | Subject,
      onError?: (error: any) => any,
      Complete?: (item: T) => any
    ): rx$Subscription;
  }

  declare class Disposable {
    static create: () => Disposable;
    dispose: () => void;
  }

  declare class CompositeDisposable extends Disposable {
    add(item: Disposable): void;
  }

  declare class Subject<T> extends Observable<T> mixins rx$Observer{
    onNext(item: T): void;
  }

  declare class ReplaySubject<T> extends Subject<T> {
    constructor(count: number): Observable<T>;
  }
}
