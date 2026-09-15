export class ValidationException extends Error {
    constructor(errors) {
        super("Validation failed");

        this.name = "ValidationException";
        this.errors = errors;
        this.status = 422;
    }
}
