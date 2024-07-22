import { Effect } from "effect";
import { Handler } from "../../types";
import Exams from "../workflows/exams";

// pages
export const exams: Handler = (_, res) =>
  Effect.gen(function* () {
    const exams = yield* Exams.listExams;
    return res.render("pages/exams/list.njk", { exams });
  });

export const examDetail: Handler = (req, res) =>
  Effect.gen(function* () {
    const exam = yield* Exams.getExam(req.params.id);
    return res.render("pages/exams/detail.njk", { exam });
  });

export const examCreate: Handler = (_, res) =>
  Effect.gen(function* () {
    return res.render("pages/exams/create.njk");
  });

export const examEdit: Handler = (req, res) =>
  Effect.gen(function* () {
    const exam = yield* Exams.getExam(req.params.id);
    return res.render("pages/exams/edit.njk", { exam });
  });

// partials
export const listExams: Handler = (_, res) =>
  Effect.gen(function* () {
    const exams = Exams.listExams;
    return res.render("pages/exams/exam-list.njk", { exams });
  });

export const createExam: Handler = (req, res) =>
  Effect.gen(function* () {
    const exam = yield* Exams.createExam(req.body);
    return res.redirect(`/exams/${exam.id}`);
  });

export const updateExam: Handler = (req, res) =>
  Effect.gen(function* () {
    const exam = yield* Exams.updateExam({ id: req.params.id, ...req.body });
    return res.redirect(303, `/exams/${exam.id}`);
  });
