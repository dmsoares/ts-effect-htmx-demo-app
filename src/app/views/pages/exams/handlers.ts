import { Effect } from "effect";
import { Handler } from "../../../types";
import {
  CreateExam,
  GetExam,
  ListExams,
  UpdateExam,
} from "../../../../core/workflows";

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

export const examEdit: Handler = (req, res) =>
  Effect.gen(function* () {
    res.locals.exam = yield* GetExam.workflow(req.params.id);
    return res.render("pages/exams/edit.njk");
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
    return res.redirect(`/exams/${exam.id}`);
  });

export const updateExam: Handler = (req, res) =>
  Effect.gen(function* () {
    const exam = yield* UpdateExam.workflow({ id: req.params.id, ...req.body });
    return res.redirect(303, `/exams/${exam.id}`);
  });
