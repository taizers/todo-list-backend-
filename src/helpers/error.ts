export class ApplicationError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message || 'Internal Server Error');
    this.name = this.constructor.name;
    this.status = status || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ResourceNotFoundError extends ApplicationError {
  data: object;

  constructor(resource: string) {
    super(`Resource ${resource} not found.`, 404);
    this.data = { resource };
  }
}

export class EntityNotFoundError extends ApplicationError {
  data: object;

  constructor(id: string, entity: string) {
    super(`Entity ${entity}, id=${id} not found in the database.`, 404);
    this.data = { id };
  }
}

export class UnAuthorizedError extends ApplicationError {
  constructor() {
    super(`UnAuthorized Error.`, 401);
  }
}

export class BadCredentialsError extends ApplicationError {
  constructor(message: string) {
    super(`Bad Credentials Error: ${message}`, 401);
  }
}

export class UnProcessableEntityError extends ApplicationError {
  constructor(message: string) {
    super(`UnProcessable Entity Error: ${message}`, 422);
  }
}

export class InternalError extends ApplicationError {
  data: object;

  constructor(error: { message: string; status: number }, message: string) {
    super(message || error.message, error.status);
    this.data = { error };
  }
}
