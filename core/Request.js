export class Request {

    constructor(req) {
        this.raw = req;
        this.params = {};
        this.body = null;
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

    setParams(params) {
        this.params = params;

        return this;
    }

    async parseBody() {
        const chunks = [];

        for await (const chunk of this.raw) {
            chunks.push(chunk);
        }

        const body = Buffer.concat(chunks).toString();

        if (!body) {
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
                this.body = JSON.parse(body);
            } catch {
                this.body = null;
            }

            return this.body;
        }

        this.body = body;

        return this.body;
    }
}
