import { Layer, Effect } from "effect";
import * as Browser from "./browser/handlers";
import * as Api from "./api/handlers";
import { get, post, put } from "./route-constructors";

const BrowserRoutesLive = Layer.scopedDiscard(
  Effect.gen(function* () {
    // pages
    yield* get("/", Browser.home);
    yield* get("/exams", Browser.exams);
    yield* get("/exams/create", Browser.examCreate);
    yield* get("/exams/:id", Browser.examDetail);
    yield* get("/exams/:id/edit", Browser.examEdit);
    // partials
    yield* get("/partials/exams", Browser.listExams);
    yield* post("/partials/exams", Browser.createExam);
    yield* put("/partials/exams/:id", Browser.updateExam);
  })
);

const ApiRoutesLive = Layer.scopedDiscard(
  Effect.gen(function* () {
    yield* get("/api/exams", Api.listExams);
    yield* get("/api/exams/:id", Api.getExam);
    yield* post("/api/exams", Api.createExam);
  })
);

export const RoutesLive = Layer.merge(BrowserRoutesLive, ApiRoutesLive);
