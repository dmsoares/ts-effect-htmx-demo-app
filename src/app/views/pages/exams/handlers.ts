import { Effect } from "effect";
import { Handler } from "../../../types";
import { CreateExam, GetExam, ListExams } from "../../../../core/workflows";

// pages
export const exams: Handler = (_, res) =>
  Effect.gen(function* () {
    const exams = yield* ListExams.workflow;
    return res.render("pages/exams/list.njk", { exams });
  });

export const examDetail: Handler = (req, res) =>
  Effect.gen(function* () {
    const exam = yield* GetExam.workflow(req.params.id);
    return res.render("pages/exams/detail.njk", { exam });
  });

export const examCreate: Handler = (_, res) =>
  Effect.gen(function* () {
    return res.render("pages/exams/create.njk");
  });

// partials
export const listExams: Handler = (_, res) =>
  Effect.gen(function* () {
    const exams = yield* ListExams.workflow;
    return res.render("pages/exams/exam-list.njk", { exams });
  });

export const createExam: Handler = (req, res) =>
  Effect.gen(function* () {
    const exam = yield* CreateExam.workflow(req.body);
    return res.redirect(`/exams/detail/${exam.id}`);
  });
