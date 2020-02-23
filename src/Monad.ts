export interface Monad<T> {
  map<V>(fn: (v: T) => V) : Monad<V>;
  flatMap<V>(fn: (v: T) => Monad<V>) : Monad<V>;
}