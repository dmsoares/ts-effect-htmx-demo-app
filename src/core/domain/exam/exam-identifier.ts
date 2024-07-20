import { Effect as E } from "effect";
import { v4 as uuidv4, validate } from "uuid";
import { ValidationError } from "../errors";

const sym: unique symbol = Symbol("ExamId");

export interface ExamId {
  readonly [sym]: typeof sym;
  readonly id: string;
}

export const create = (id: string): E.Effect<ExamId, ValidationError> =>
  validate(id)
    ? E.succeed({ [sym]: sym, id })
    : E.fail(new ValidationError("Invalid exam id"));

export const generate = (): ExamId => ({ [sym]: sym, id: uuidv4() });
