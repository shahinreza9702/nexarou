import { ValidationException } from "./ValidationException.js";

export class Validator {
    constructor(data = {}, rules = {}) {
        this.data = data;
        this.rules = rules;
        this.errors = {};
    }

    async validate() {
        for (const field of Object.keys(this.rules)) {
            const rules = this.normalizeRules(
                this.rules[field]
            );

            const value = this.data[field];

            for (const rule of rules) {
                await this.checkRule(
                    field,
                    value,
                    rule
                );
            }
        }

        if (Object.keys(this.errors).length > 0) {
            throw new ValidationException(
                this.errors
            );
        }

        return this.data;
    }

    normalizeRules(rules) {
        if (Array.isArray(rules)) {
            return rules;
        }

        return rules
            .split("|")
            .filter(Boolean);
    }

    addError(field, message) {
        if (!this.errors[field]) {
            this.errors[field] = [];
        }

        this.errors[field].push(message);
    }

    async checkRule(field, value, rule) {
        const [name, argument] =
            rule.split(":");

        switch (name) {
            case "required":
                this.required(
                    field,
                    value
                );
                break;

            case "string":
                this.string(
                    field,
                    value
                );
                break;

            case "email":
                this.email(
                    field,
                    value
                );
                break;

            case "integer":
                this.integer(
                    field,
                    value
                );
                break;

            case "min":
                this.min(
                    field,
                    value,
                    argument
                );
                break;

            case "max":
                this.max(
                    field,
                    value,
                    argument
                );
                break;

            default:
                throw new Error(
                    `Unknown validation rule: ${name}`
                );
        }
    }

    required(field, value) {
        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            this.addError(
                field,
                `The ${field} field is required.`
            );
        }
    }

    string(field, value) {
        if (
            value !== undefined &&
            value !== null &&
            typeof value !== "string"
        ) {
            this.addError(
                field,
                `The ${field} must be a string.`
            );
        }
    }

    email(field, value) {
        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return;
        }

        const pattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!pattern.test(value)) {
            this.addError(
                field,
                `The ${field} must be a valid email.`
            );
        }
    }

    integer(field, value) {
        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return;
        }

        if (
            !Number.isInteger(
                Number(value)
            )
        ) {
            this.addError(
                field,
                `The ${field} must be an integer.`
            );
        }
    }

    min(field, value, min) {
        if (
            value === undefined ||
            value === null
        ) {
            return;
        }

        const number =
            Number(value);

        if (
            !Number.isNaN(number) &&
            number < Number(min)
        ) {
            this.addError(
                field,
                `The ${field} must be at least ${min}.`
            );

            return;
        }

        if (
            typeof value === "string" &&
            value.length < Number(min)
        ) {
            this.addError(
                field,
                `The ${field} must be at least ${min} characters.`
            );
        }
    }

    max(field, value, max) {
        if (
            value === undefined ||
            value === null
        ) {
            return;
        }

        const number =
            Number(value);

        if (
            !Number.isNaN(number) &&
            number > Number(max)
        ) {
            this.addError(
                field,
                `The ${field} may not be greater than ${max}.`
            );

            return;
        }

        if (
            typeof value === "string" &&
            value.length > Number(max)
        ) {
            this.addError(
                field,
                `The ${field} may not be greater than ${max} characters.`
            );
        }
    }
}
