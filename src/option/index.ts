export interface Optional<T> {
  map<V>(fn: (v: T) => V) : Optional<V>;
  flatMap<V>(fn: (v: T) => Optional<V>) : Optional<V>;
  getOrElse(v: T): T;

  // That should be a problem when it is a object
  // TODO: Implement something like a deep equal
  exists(v: T): Boolean;

  get(): T;
  isEmpty(): Boolean;
  isDefined(): Boolean;
}

export class Option<T> {
  static of<W>(v: W): Optional<W> {
    if (!v) {
      return new None();
    }

    return new Some(v);
  }

  static none<W>(): None<W> {
    return new None();
  }
}

export class Some<T> extends Option<T> implements Optional<T> {
  constructor(public readonly value: T) {
    super();
  }

  flatMap<V>(fn: (v: T) => Optional<V>): Optional<V> {
    return fn(this.value);
  }

  map<V>(fn: (v: T) => V): Optional<V> {
    return Option.of(fn(this.value));
  }

  getOrElse(orElse: T): T {
    return this.value;
  }

  isEmpty(): Boolean {
    return false;
  }

  isDefined(): Boolean {
    return true;
  }

  get(): T {
    return this.value;
  }

  exists(v: T): Boolean {
    return this.value === v;
  }
}

export class None<T> extends Option<T> implements Optional<T> {

  map<V>(fn: (v: T) => V): Optional<V> {
    return Option.none();
  }

  flatMap<V>(fn: (v: T) => Optional<V>): Optional<V> {
    return Option.none();
  }

  getOrElse(orElse: T): T {
    return orElse;
  }

  isEmpty(): Boolean {
    return true;
  }

  isDefined(): Boolean {
    return false;
  }

  get(): T {
    throw new Error("Empty optional value");
  }

  exists(v: T): Boolean {
    return false;
  }
}

