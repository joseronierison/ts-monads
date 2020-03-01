[![ts-monads](https://circleci.com/gh/joseronierison/ts-monads.svg?style=svg)](https://app.circleci.com/github/joseronierison/ts-monads/pipelines)

Type Script Monads

Inspired in the Scala Monads

### Installation

```shell script
npm i ts-monads
```

### Runnings tests locally

```shell script
npm test
```

### Doc
Table of contents

- [Optional](https://github.com/joseronierison/ts-monads#option)

#### Option
```typescript
import { Optional, Option } from "ts-monads/option";

const maybeTen: Optional<number> = Option.of(10);
const maybeTwo: Optional<number> = Option.of(2);
const maybeFive: Optional<number> = Option.of(5);

const optionalOperation = 
  maybeFive
    .map(five => five * 2)
    .flatMap(v => maybeTen.map(h => h * v))
    .flatMap(v => maybeTwo.map(h => v / h));

const noneValue = Option.none();

const noneOp = maybeTen.flatMap(g => noneValue.map(n => n * g));

console.log(optionalOperation.getOrElse(0)); // 50
console.log(noneOp.getOrElse(10)); // 10
```

#### Try
```typescript
import { Tryable, Try } from "ts-monads/try";

const tryTen: Tryable<number> = Try.run(() => 10);
const tryFive: Tryable<number> = Try.run(() => 5);
const tryFailed: Tryable<number> = Try.run(() => { throw new Error("Something went wrong!") });

const riskOperation = 
  tryFive
    .map(five => five * 2)
    .flatMap(ten => tryTen.map(anotherTen => ten * anotherTen));

const failedOp = tryFailed.flatMap(g => tryTen.map(n => n * g));

console.log(riskOperation.getOrElse(0)); // 100
console.log(riskOperation.isSuccess()); // true

console.log(failedOp.getOrElse(10)); // 10
console.log(riskOperation.isFailure()); // true
console.log(riskOperation.getError()); // Error("Something went wrong!")
```

### Contributing
