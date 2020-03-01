import { expect } from "chai";
import { Optional, None, Option, Some } from "../../src/option";

describe("Option", () => {
  describe("Some value", () => {
    const myValue = 42;
    const optionOfValue: Optional<number> = Option.of(myValue);

    it("should return some with value", () => {
      expect(optionOfValue).to.be.instanceOf(Some);
      expect(optionOfValue.get()).to.be.equal(myValue);
    });

    it("should be defined", () => {
      expect(optionOfValue.isDefined()).to.be.true;
    });

    it("should return the main value on getOrElse", () => {
      expect(optionOfValue.getOrElse(9)).to.be.equal(myValue);
    });

    it("should not be empty", () => {
      expect(optionOfValue.isEmpty()).to.be.false;
    });

    describe("map", () => {
      it("should return new optional value when map to something else", () => {
        const newOption = optionOfValue.map(v => (v / 2).toString());

        expect(newOption).to.be.deep.equal(Option.of("21"));
      });

      it("should properly compose map functions", () => {
        const newOption =
          optionOfValue
            .map(v => v / 2)
            .map(v => v + 1)
            .map(v => (v * 3).toString());

        expect(newOption).to.be.deep.equal(Option.of("66"));
      });

      it("should be none when map to null", () => {
        const newOption =
          optionOfValue
            .map(v => v / 2)
            .map(v => null)
            .map(v => v + 1);

        expect(newOption).to.be.deep.equal(Option.none());
      });
    });

    describe("flatMap", () => {
      it("should return a Optional value flatted with another one", () => {
        const anotherOptional = Option.of(30);

        const flatMapped = optionOfValue.flatMap(v => anotherOptional.map(h => h + v));

        expect(flatMapped).to.be.deep.equal(Option.of(72));
      });

      it("properly compose when something is nullable", () => {
        const anotherOptional = Option.of(30);

        const flatMapped =
          optionOfValue
            .flatMap(_ => Option.none<number>())
            .flatMap(v => anotherOptional.map(h => h + v));

        expect(flatMapped).to.be.deep.equal(Option.none());
      });
    });

    describe("exists", () => {
      it("exists when provide the same value from the wrapped one", () => {
        expect(optionOfValue.exists(42)).to.be.true;
      });

      it("doesn't exist when provide a different value from the wrapped one", () => {
        expect(optionOfValue.exists(12)).to.be.false;
      });
    });
  });

  describe("None value", () => {
    const noneValue: Optional<number> = Option.of(null);

    it("should return Some with value", () => {
      expect(noneValue).to.be.instanceOf(None);
      expect(() => noneValue.get()).to.throw(Error, /Empty optional value/);
    });

    it("should return the main value on getOrElse", () => {
      let expectedElseValue = 9;
      expect(noneValue.getOrElse(expectedElseValue)).to.be.equal(expectedElseValue);
    });

    it("should not be defined", () => {
      expect(noneValue.isDefined()).to.be.false;
    });

    it("should be empty", () => {
      expect(noneValue.isEmpty()).to.be.true;
    });

    describe("map", () => {
      it("should return none even when map to some value", () => {
        const newOption = noneValue.map(v => (v / 2).toString());

        expect(newOption).to.be.deep.equal(Option.none());
      });
    });

    describe("flatMap", () => {
        it("should return none even when flatMap to some value", () => {
          const newOption = noneValue.flatMap(v => Option.of(3));

          expect(newOption).to.be.deep.equal(Option.none());
        });
      });

    describe("exists", () => {
      it("doesn't exist when provide anything", () => {
        expect(noneValue.exists(12)).to.be.false;
      });
    });
  });
});