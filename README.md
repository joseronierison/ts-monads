[![ts-monads](https://circleci.com/gh/joseronierison/ts-monads.svg?style=svg)](https://app.circleci.com/github/joseronierison/ts-monads/pipelines)

Type Script Monads

Inspired in the Scala Monads

### Installation

```
npm i ts-monads
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

### Contributing
