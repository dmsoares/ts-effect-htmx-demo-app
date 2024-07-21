import { Effect } from "effect";
import { Handler, Route } from "../types";
import {
  createExam,
  examDetail,
  listExams,
  exams,
  examCreate,
} from "./pages/exams/handlers";
import { home } from "./pages/home/handler";

const enhance =
  (handler: Handler): Handler =>
  (req, res) =>
    Effect.gen(function* () {
      res.locals.useLayout = req.headers["hx-request"] !== "true";
      return yield* handler(req, res);
    });

const routes: Route[] = [
  // pages
  ["get", "/", enhance(home)],
  ["get", "/exams/list", enhance(exams)],
  ["get", "/exams/detail/:id", enhance(examDetail)],
  ["get", "/exams/create", enhance(examCreate)],
  // partials
  ["get", "/partials/exams", enhance(listExams)],
  ["post", "/partials/exams/create", enhance(createExam)],
];

export default routes;
