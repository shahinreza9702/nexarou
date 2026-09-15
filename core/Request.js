import { Validator } from "./Validator.js";

export class Request {
    constructor(req) {
        this.raw = req;

        this.params = {};
        this.body = null;
        this.query = {};
    }

    async validate(rules) {
        const validator = new Validator(
            this.all(),
            rules
        );

        return await validator.validate();
    }


    get method() {
        return this.raw.method;
    }

    get url() {
        return this.raw.url;
    }

    get headers() {
        return this.raw.headers;
    }

    get path() {
        return new URL(
            this.url,
            "http://localhost"
        ).pathname;
    }

    setParams(params) {
        this.params = params;

        return this;
    }

    parseQuery() {
        const url = new URL(
            this.url,
            "http://localhost"
        );

        this.query = Object.fromEntries(
            url.searchParams.entries()
        );

        return this.query;
    }

    async parseBody() {
        const method = this.method;

        // GET/HEAD সাধারণত body প্রয়োজন করে না
        if (
            method === "GET" ||
            method === "HEAD"
        ) {
            this.body = null;
            return this.body;
        }

        const chunks = [];

        for await (const chunk of this.raw) {
            chunks.push(chunk);
        }

        const rawBody =
            Buffer.concat(chunks).toString();

        if (!rawBody) {
            this.body = null;
            return this.body;
        }

        const contentType =
            this.headers["content-type"] || "";

        if (
            contentType.includes(
                "application/json"
            )
        ) {
            try {
                this.body =
                    JSON.parse(rawBody);
            } catch {
                throw new Error(
                    "Invalid JSON body"
                );
            }

            return this.body;
        }

        if (
            contentType.includes(
                "application/x-www-form-urlencoded"
            )
        ) {
            this.body = Object.fromEntries(
                new URLSearchParams(rawBody)
            );

            return this.body;
        }

        this.body = rawBody;

        return this.body;
    }

    input(key, defaultValue = null) {
        if (
            this.body &&
            Object.prototype.hasOwnProperty.call(
                this.body,
                key
            )
        ) {
            return this.body[key];
        }

        if (
            Object.prototype.hasOwnProperty.call(
                this.query,
                key
            )
        ) {
            return this.query[key];
        }

        return defaultValue;
    }

    has(key) {
        return this.input(key) !== null;
    }

    all() {
        return {
            ...this.query,
            ...(this.body || {})
        };
    }

    header(name, defaultValue = null) {
        const key = name.toLowerCase();

        return this.headers[key] ??
            defaultValue;
    }
}
