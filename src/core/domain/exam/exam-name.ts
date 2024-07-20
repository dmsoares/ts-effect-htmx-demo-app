import { Effect as E } from "effect";
import { ValidationError } from "../errors";

const sym: unique symbol = Symbol("ExamName");

export interface ExamName {
  readonly [sym]: typeof sym;
  readonly name: string;
}

export const create = (name: string): E.Effect<ExamName, ValidationError> =>
  validate(name)
    ? E.succeed({ [sym]: sym, name })
    : E.fail(new ValidationError("Invalid exam name"));

const validate = (name: string) => name.length > 0 && name.length <= 100;
