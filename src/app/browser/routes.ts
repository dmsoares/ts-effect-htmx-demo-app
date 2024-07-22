import { Effect } from "effect";
import { Handler, Route } from "../types";
import { home } from "./views/pages/home/handler";
import {
  createExam,
  examCreate,
  examDetail,
  examEdit,
  exams,
  listExams,
  updateExam,
} from "./handlers/exams";

const enhance =
  (handler: Handler): Handler =>
  (req, res) =>
    Effect.gen(function* () {
      res.locals.useLayout = req.headers["hx-request"] !== "true";
      return yield* handler(req, res);
    });

const routes: Route[] = [
  // pages
  ["get", "/", home],
  ["get", "/exams", exams],
  ["get", "/exams/create", examCreate],
  ["get", "/exams/:id", examDetail],
  ["get", "/exams/:id/edit", examEdit],
  // partials
  ["get", "/partials/exams", listExams],
  ["post", "/partials/exams", createExam],
  ["put", "/partials/exams/:id", updateExam],
];

const enhancedRoutes: Route[] = routes.map(([method, path, handler]) => [
  method,
  path,
  enhance(handler),
]);

export default enhancedRoutes;
