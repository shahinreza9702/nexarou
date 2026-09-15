export class Response {
    constructor(res) {
        this.raw = res;
        this.statusCode = 200;
    }

    status(code) {
        this.statusCode = code;

        return this;
    }

    send(data) {
        this.raw.writeHead(this.statusCode, {
            "Content-Type": "text/plain"
        });

        this.raw.end(data);
    }

    json(data) {
        this.raw.writeHead(this.statusCode, {
            "Content-Type": "application/json"
        });

        this.raw.end(JSON.stringify(data));
    }
}
