import { Layer, Effect } from "effect";
import { Express } from "./express";

// Server Setup
export const ServerLive = Layer.scopedDiscard(
  Effect.gen(function* () {
    const port = 3001;
    const app = yield* Express;

    yield* Effect.acquireRelease(
      Effect.sync(() =>
        app.listen(port, () =>
          console.log(`Example app listening on port ${port}`)
        )
      ),
      (server) => Effect.sync(() => server.close())
    );
  })
);
