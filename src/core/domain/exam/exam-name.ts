import { Effect as E } from "effect";
import { ValidationError } from "../errors";
import { ValueObject } from "../value-object";

const sym: unique symbol = Symbol("ExamName");

export class ExamName implements ValueObject<ExamName> {
  readonly [sym]: typeof sym = sym;

  private constructor(readonly name: string) {
    this.name = name;
  }

  static create = (name: string): E.Effect<ExamName, ValidationError> =>
    name.length > 0 && name.length <= 100
      ? E.succeed(new ExamName(name))
      : E.fail(new ValidationError("Invalid exam name"));

  equals(other: ExamName): boolean {
    return this.name === other.name;
  }
}
