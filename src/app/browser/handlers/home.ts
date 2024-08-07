import { Effect } from "effect";
import { Request, Response } from "../../types";
import { withHtmx } from "./handler";

export const home = withHtmx((_: Request, res: Response) =>
  Effect.gen(function* () {
    return res.render("pages/home/home.njk");
  })
);
