import { Effect } from "effect";
import { Request, Response } from "../../types";
import { handler, withHtmx } from "./handler";
import { BrowserWorkflows } from "../workflows/exams";

export const exams = withHtmx(
  handler((_: Request, res: Response) =>
    Effect.gen(function* () {
      const exams = yield* (yield* BrowserWorkflows).listExams;
      return res.render("pages/exams/list.njk", { exams });
    })
  )
);

export const examDetail = withHtmx(
  handler((req: Request, res: Response) =>
    Effect.gen(function* () {
      const exam = yield* (yield* BrowserWorkflows).getExam(req.params.id);
      return res.render("pages/exams/detail.njk", { exam });
    })
  )
);

export const examCreate = withHtmx(
  handler((_: Request, res: Response) =>
    Effect.gen(function* () {
      return res.render("pages/exams/create.njk");
    })
  )
);

export const examEdit = withHtmx(
  handler((req: Request, res: Response) =>
    Effect.gen(function* () {
      const exam = yield* (yield* BrowserWorkflows).getExam(req.params.id);
      return res.render("pages/exams/edit.njk", { exam });
    })
  )
);

// partials
export const listExams = withHtmx(
  handler((_: Request, res: Response) =>
    Effect.gen(function* () {
      const exams = yield* (yield* BrowserWorkflows).listExams;
      return res.render("pages/exams/exam-list.njk", { exams });
    })
  )
);

export const createExam = withHtmx(
  handler((req: Request, res: Response) =>
    Effect.gen(function* () {
      const exam = yield* (yield* BrowserWorkflows).createExam(req.body);
      return res.redirect(`/exams/${exam.id}`);
    })
  )
);

export const updateExam = withHtmx(
  handler((req: Request, res: Response) =>
    Effect.gen(function* () {
      const exam = yield* (yield* BrowserWorkflows).updateExam({
        id: req.params.id,
        ...req.body,
      });
      return res.redirect(303, `/exams/${exam.id}`);
    })
  )
);
