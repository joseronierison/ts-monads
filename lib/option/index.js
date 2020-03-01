"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Option {
    static of(v) {
        if (!v) {
            return new None();
        }
        return new Some(v);
    }
    static none() {
        return new None();
    }
}
exports.Option = Option;
class Some extends Option {
    constructor(value) {
        super();
        this.value = value;
    }
    flatMap(fn) {
        return fn(this.value);
    }
    map(fn) {
        return Option.of(fn(this.value));
    }
    getOrElse(orElse) {
        return this.value;
    }
    isEmpty() {
        return false;
    }
    isDefined() {
        return true;
    }
    get() {
        return this.value;
    }
    exists(v) {
        return this.value === v;
    }
}
exports.Some = Some;
class None extends Option {
    map(fn) {
        return Option.none();
    }
    flatMap(fn) {
        return Option.none();
    }
    getOrElse(orElse) {
        return orElse;
    }
    isEmpty() {
        return true;
    }
    isDefined() {
        return false;
    }
    get() {
        throw new Error("Empty optional value");
    }
    exists(v) {
        return false;
    }
}
exports.None = None;
//# sourceMappingURL=index.js.map