type jasmine$Suite = () => void;
type jasmine$Test = (done: () => void) => void;

declare function describe(name: string, suite: jasmine$Suite): void;
declare function it(name: string, test: jasmine$Test): void;

declare function expect<T>(value: T): {
  toBe: (newValue: T) => void;
};
