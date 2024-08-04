import { Effect } from "effect";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express-serve-static-core";

export type Request = ExpressRequest;
export type Response = ExpressResponse;

export type Handler = (
  req: Request,
  res: Response
) => Effect.Effect<unknown, Error, unknown>;
export type Method = "get" | "post" | "put";
export type Path = string;

export type Route = [Method, Path, Handler];
