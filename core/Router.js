export class Router {
    constructor() {
        this.routes = [];
    }

    get(path, handler) {
        this.routes.push({
            method: "GET",
            path,
            handler
        });
    }

    post(path, handler) {
        this.routes.push({
            method: "POST",
            path,
            handler
        });
    }

    resolve(method, path) {
        return this.routes.find(
            route => route.method === method && route.path === path
        );

    }
}