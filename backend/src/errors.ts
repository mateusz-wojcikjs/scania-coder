export class CustomError extends Error {
    public statusCode: number;
    public errorCode: string;

    constructor(message: string, statusCode: number, errorCode: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestError extends CustomError {
    constructor(errorCode: string) {
        super("Bad Request", 400, errorCode);
    }
}

export class UnauthorizedError extends CustomError {
    constructor(errorCode: string) {
        super("Unauthorized", 401, errorCode);
    }
}

export class InternalServerError extends CustomError {
    constructor(errorCode: string) {
        super("Internal Server Error", 500, errorCode);
    }
}
