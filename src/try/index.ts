import { Optional, Option } from "../option";
import { UnsupportedOperationError } from "../exceptions/UnsupportedOperationError";


export interface Tryable<T> {
  map<V>(fn: (v: T) => V) : Tryable<V>;
  flatMap<V>(fn: (v: T) => Tryable<V>) : Tryable<V>;
  flatten(): Tryable<T>;
  get(): T;
  getOrElse(alternativeValue: T): T;

  // That should be a problem when it is a object
  // TODO: Implement something like a deep equal
  exists(v: T): Boolean;

  toOption(): Optional<T>;
  isSuccess(): Boolean;
  isFailure(): Boolean;
  failed(): Tryable<Error>;
  getError(): Error;
}

export class Try<T> {
  static run<W>(riskOperation: () => W): Tryable<W> {
    try {
      return new Try.Success(riskOperation());
    } catch (e) {
      return new Try.Failed(e);
    }
  }

  static readonly Success: any = class TrySuccess<T> extends Try<T> implements Tryable<T> {
    constructor(private readonly value: T) {
      super();
    }

    flatMap<V>(fn: (v: T) => Tryable<V>): Tryable<V> {
      return fn(this.value);
    }

    map<V>(fn: (v: T) => V): Tryable<V> {
      return Try.run(() => fn(this.value));
    }

    flatten(): Tryable<T> {
      if (
        this.value instanceof Try.Success ||
        this.value instanceof Try.Failed
      ) {
        return (this.value as any).flatten();
      }

      return new Try.Success(this.value);
    }

    get(): T {
      return this.value;
    }

    exists(v: T): Boolean {
      return this.value === v;
    }

    getOrElse(alternativeValue: T): T {
      return this.value;
    }

    isFailure(): Boolean {
      return false;
    }

    isSuccess(): Boolean {
      return true;
    }

    toOption(): Optional<T> {
      return Option.of(this.value);
    }

    failed(): Tryable<Error> {
      return new Try.Failed(new UnsupportedOperationError("Success.failed"));
    }

    getError(): Error {
      throw new UnsupportedOperationError("Success.failed");
    };
  };

  static readonly Failed: any = class TryFailed<T> extends Try<T> implements Tryable<T> {
    constructor(private readonly error: Error) {
      super();
    }

    flatMap<V>(fn: (v: T) => Tryable<V>): Tryable<V> {
      return new Try.Failed(this.error);
    }

    map<V>(fn: (v: T) => V): Tryable<V> {
      return new Try.Failed(this.error);
    }

    flatten(): Tryable<T> {
      return new Try.Failed(this.error);
    }

    exists(v: T): Boolean {
      return false;
    }

    get(): T {
      throw this.error;
    }

    getOrElse(alternativeValue: T): T {
      return alternativeValue;
    }

    isFailure(): Boolean {
      return true;
    }

    isSuccess(): Boolean {
      return false;
    }

    toOption(): Optional<T> {
        return Option.none();
    }

    failed(): Tryable<Error> {
      return new Try.Success(this.error);
    }

    getError(): Error {
      return this.error;
    };
  };
}