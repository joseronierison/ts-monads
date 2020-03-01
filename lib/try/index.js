"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const option_1 = require("../option");
const UnsupportedOperationError_1 = require("../exceptions/UnsupportedOperationError");
class Try {
    static run(riskOperation) {
        try {
            return new Try.Success(riskOperation());
        }
        catch (e) {
            return new Try.Failed(e);
        }
    }
}
exports.Try = Try;
Try.Success = class TrySuccess extends Try {
    constructor(value) {
        super();
        this.value = value;
    }
    flatMap(fn) {
        return fn(this.value);
    }
    map(fn) {
        return Try.run(() => fn(this.value));
    }
    flatten() {
        if (this.value instanceof Try.Success ||
            this.value instanceof Try.Failed) {
            return this.value.flatten();
        }
        return new Try.Success(this.value);
    }
    get() {
        return this.value;
    }
    exists(v) {
        return this.value === v;
    }
    getOrElse(alternativeValue) {
        return this.value;
    }
    isFailure() {
        return false;
    }
    isSuccess() {
        return true;
    }
    toOption() {
        return option_1.Option.of(this.value);
    }
    failed() {
        return new Try.Failed(new UnsupportedOperationError_1.UnsupportedOperationError("Success.failed"));
    }
    getError() {
        throw new UnsupportedOperationError_1.UnsupportedOperationError("Success.failed");
    }
    ;
};
Try.Failed = class TryFailed extends Try {
    constructor(error) {
        super();
        this.error = error;
    }
    flatMap(fn) {
        return new Try.Failed(this.error);
    }
    map(fn) {
        return new Try.Failed(this.error);
    }
    flatten() {
        return new Try.Failed(this.error);
    }
    exists(v) {
        return false;
    }
    get() {
        throw this.error;
    }
    getOrElse(alternativeValue) {
        return alternativeValue;
    }
    isFailure() {
        return true;
    }
    isSuccess() {
        return false;
    }
    toOption() {
        return option_1.Option.none();
    }
    failed() {
        return new Try.Success(this.error);
    }
    getError() {
        return this.error;
    }
    ;
};
//# sourceMappingURL=index.js.map