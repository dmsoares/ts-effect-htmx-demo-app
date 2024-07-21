import { Effect } from "effect";
import { Request, Response } from "express-serve-static-core";

export type Handler = (
  req: Request,
  res: Response
) => Effect.Effect<unknown, Error>;
export type Method = "get" | "post";
export type Path = string;

export type Route = [Method, Path, Handler];
