export class BaseError extends Error {}

export class DomainError extends BaseError {
  readonly _tag = "DomainError";
}

export class WorkflowError extends BaseError {
  readonly _tag = "WorkflowError";
}

export class ValidationError extends BaseError {
  readonly _tag = "ValidationError";
}

export class DBError extends BaseError {
  readonly _tag = "DBError";
}

export class NotFoundError extends BaseError {
  readonly _tag = "NotFoundError";
}

export class MalformedDataError extends BaseError {
  readonly _tag = "MalformedDataError";
}
