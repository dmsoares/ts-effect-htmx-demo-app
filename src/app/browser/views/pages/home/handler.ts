import { Effect } from "effect";
import { Handler } from "../../../../types";

export const home: Handler = (_, res) =>
  Effect.gen(function* () {
    return res.render("pages/home/home.njk");
  });
