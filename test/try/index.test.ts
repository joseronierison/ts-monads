import { expect } from "chai";
import { Option } from "../../src/option";
import { Try, Tryable } from "../../src/try";
import { UnsupportedOperationError } from "../../src/exceptions/UnsupportedOperationError";

describe("Try", () => {
  describe("Fails when a exception is raised", () => {
    const testError = class TestError extends Error {}

    const errorMessage = "Any IO sync error";
    const testFailure = new testError(errorMessage);

    const tryFailed = Try.run<String>(() => {
      throw testFailure;
    });

    it("should be failed",  () => {
      expect(tryFailed.isFailure()).to.be.true;
    });

    it("should not be success",  () => {
      expect(tryFailed.isSuccess()).to.be.false;
    });

    it("should contain nothing inside but error",  () => {
      expect(tryFailed.exists("something")).to.be.false;
    });

    it("should wrap up the Error", () => {
      const error = tryFailed.failed();
      expect(error).to.be.instanceOf(Try.Success);
      const failure = error.get();
      expect(failure).to.be.equal(testFailure);
    });

    it("should be None when transformed to Option", () => {
      expect(tryFailed.toOption()).to.be.deep.equal(Option.none());
    });

    it("should return alternative value in getOrElse", () => {
      const expectedValue = "alternative value";
      expect(tryFailed.getOrElse(expectedValue)).to.be.equal(expectedValue);
    });

    it("should raise the exception when tries to get the value", () => {
      expect(() => {
        tryFailed.get();
      }).to.throw(testError);
    });

    it("should map to the error even when non failures operations are mapped", () => {
      const stillFailing = tryFailed.map(() => "success");

      expect(stillFailing.isFailure()).to.be.true;
      expect(stillFailing.failed().get()).to.be.deep.equal(testFailure);
    });

    it("should flatMap to the error even when non failures operations are flatMapped", () => {
      const stillFailing = tryFailed.flatMap(() => Try.run(() => "success"));

      expect(stillFailing.isFailure()).to.be.true;
      expect(stillFailing.failed().get()).to.be.deep.equal(testFailure);
    });

    it("should return the error raise in run operation", () => {
      expect(tryFailed.getError()).to.deep.equal(testFailure);
    });

    it("should flatten a bunch of tries", () => {
      const aBunchOfTries: Tryable<Tryable<Tryable<string>>> = Try
        .run( () => tryFailed
          .map(v => Try.run( () => `${v} :)`)));

      expect(aBunchOfTries.flatten()).to.be.deep.equal(tryFailed);
    });
  });

  describe("Succeed when no exception is raised", () => {
    const riskMathOp = Try.run(() => 10 / 2);

    it("should be success", () => {
      expect(riskMathOp.isSuccess()).to.be.true;
    });

    it("should not be a failure", () => {
      expect(riskMathOp.isFailure()).to.be.false;
    });

    it("should return Some with operation value when toOption is called", () => {
      expect(riskMathOp.toOption()).to.be.deep.equal(Option.of(5));
    });

    it("should return failed UnsupportedOperationError when tries to get Failed from Success", () => {
      const failedOoops = riskMathOp.failed();
      expect(failedOoops.getError()).to.be.instanceOf(UnsupportedOperationError);
    });

    it("should raise failed UnsupportedOperationError when tries to get Error from Success", () => {
      expect(() => riskMathOp.getError()).to.throw(UnsupportedOperationError);
    });

    it("should say the value provided exists when it really exists", () => {
      expect(riskMathOp.exists(5)).to.be.true;
    });

    it("should not say the value provided exists when it doesn't exists", () => {
      expect(riskMathOp.exists(2)).to.be.false;
    });

    it("should return the value wrapped when get is called", () => {
      expect(riskMathOp.get()).to.be.equal(5);
    });

    it("should return the value wrapped when getOrElse is called", () => {
      expect(riskMathOp.getOrElse(8)).to.be.equal(5);
    });

    it("should map over risk operation value", () => {
      const mappedRiskMathOp =
        riskMathOp
          .map(v => v + 3)
          .map(v => v * 10);

      expect(mappedRiskMathOp.get()).to.be.equal(80);
    });

    it("should map over risk operation value but a error is thrown", () => {
      const theSomethingThatWentWrong = new Error("is 1/0 infinity, Javascript??");
      const mappedRiskMathOp =
        riskMathOp
          .map(v => v + 3)
          .map(_ => { throw theSomethingThatWentWrong })
          .map(v => v * 10);

      expect(mappedRiskMathOp.getError()).to.deep.equal(theSomethingThatWentWrong);
    });

    it("should flatMap over risk operation value", () => {
      const mappedRiskMathOp =
        riskMathOp
          .flatMap(v => Try.run(() => v + 3))
          .flatMap(v => Try.run(() => v * 10));

      expect(mappedRiskMathOp.get()).to.be.equal(80);
    });

    it("should flatMap over risk operation value but a error is thrown", () => {
      const theSomethingThatWentWrong = new Error("is 1/0 infinity, Javascript??");
      const mappedRiskMathOp =
        riskMathOp
          .flatMap(v => Try.run( () => v + 3 ))
          .map(_ => { throw theSomethingThatWentWrong })
          .flatMap(v => Try.run( () => v * 10));

      expect(mappedRiskMathOp.getError()).to.deep.equal(theSomethingThatWentWrong);
    });

    it("should flatten a bunch of tries", () => {
      const aBunchOfTries: Tryable<Tryable<Tryable<number>>> = Try
        .run( () => riskMathOp
          .map(v => Try.run( () => v + 2)));

      expect(aBunchOfTries.flatten()).to.be.deep.equal(new Try.Success(7));
    });
  });
});