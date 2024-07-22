import { Effect } from "effect";
import { UnknownKeysParam, ZodRawShape, ZodTypeAny, z } from "zod";
import { MalformedDataError } from "../../core/domain";

export const validateBody = <
  T extends ZodRawShape,
  UnknownKeys extends UnknownKeysParam,
  Catchall extends ZodTypeAny,
  Out
>(
  zSchema: z.ZodObject<T, UnknownKeys, Catchall, Out>,
  body: unknown
): Effect.Effect<Out, MalformedDataError> =>
  Effect.gen(function* () {
    const result = zSchema.safeParse(body);
    if (!result.success) {
      return yield* Effect.fail(
        new MalformedDataError(`Malformed body: ${result.error.message}`)
      );
    }
    return result.data;
  });
