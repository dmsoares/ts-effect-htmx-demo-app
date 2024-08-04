import { Effect } from "effect";
import { Request, Response } from "../../types";
import { withHtmx } from "./with-htmx";
import { BrowserWorkflows } from "../workflows/exams";

export const exams = withHtmx((_: Request, res: Response) =>
  Effect.gen(function* () {
    const exams = yield* (yield* BrowserWorkflows).listExams;
    return res.render("pages/exams/list.njk", { exams });
  })
);

export const examDetail = withHtmx((req: Request, res: Response) =>
  Effect.gen(function* () {
    const exam = yield* (yield* BrowserWorkflows).getExam(req.params.id);
    return res.render("pages/exams/detail.njk", { exam });
  })
);

export const examCreate = withHtmx((_: Request, res: Response) =>
  Effect.gen(function* () {
    return res.render("pages/exams/create.njk");
  })
);

export const examEdit = withHtmx((req: Request, res: Response) =>
  Effect.gen(function* () {
    const exam = yield* (yield* BrowserWorkflows).getExam(req.params.id);
    return res.render("pages/exams/edit.njk", { exam });
  })
);

// partials
export const listExams = withHtmx((_: Request, res: Response) =>
  Effect.gen(function* () {
    const exams = yield* (yield* BrowserWorkflows).listExams;
    return res.render("pages/exams/exam-list.njk", { exams });
  })
);

export const createExam = withHtmx((req: Request, res: Response) =>
  Effect.gen(function* () {
    const exam = yield* (yield* BrowserWorkflows).createExam(req.body);
    return res.redirect(`/exams/${exam.id}`);
  })
);

export const updateExam = withHtmx((req: Request, res: Response) =>
  Effect.gen(function* () {
    const exam = yield* (yield* BrowserWorkflows).updateExam({
      id: req.params.id,
      ...req.body,
    });
    return res.redirect(303, `/exams/${exam.id}`);
  })
);
