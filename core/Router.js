export class Router {
    constructor() {
        this.routes = [];

        this.groupStack = [
            {
                prefix: "",
                middleware: []
            }
        ];
    }

    get(path, ...handlers) {
        return this.addRoute("GET", path, handlers);
    }

    post(path, ...handlers) {
        return this.addRoute("POST", path, handlers);
    }

    put(path, ...handlers) {
        return this.addRoute("PUT", path, handlers);
    }

    patch(path, ...handlers) {
        return this.addRoute("PATCH", path, handlers);
    }

    delete(path, ...handlers) {
        return this.addRoute("DELETE", path, handlers);
    }

    addRoute(method, path, handlers) {
        const group = this.groupStack[
            this.groupStack.length - 1
        ];

        const fullPath =
            group.prefix + path;

        const middleware = [
            ...group.middleware,
            ...handlers
        ];

        this.routes.push({
            method,
            path: fullPath,
            handlers: middleware,
            segments: this.parsePath(fullPath)
        });

        return this;
    }

    group(options, callback) {
        const parent =
            this.groupStack[
                this.groupStack.length - 1
            ];

        const prefix =
            parent.prefix +
            (options.prefix || "");

        const middleware = [
            ...parent.middleware,
            ...(options.middleware || [])
        ];

        this.groupStack.push({
            prefix,
            middleware
        });

        callback();

        this.groupStack.pop();

        return this;
    }

    parsePath(path) {
        return path
            .split("/")
            .filter(Boolean);
    }

    resolve(method, url) {
        const pathname = new URL(
            url,
            "http://localhost"
        ).pathname;

        const requestSegments =
            this.parsePath(pathname);

        for (const route of this.routes) {
            if (route.method !== method) {
                continue;
            }

            if (
                route.segments.length !==
                requestSegments.length
            ) {
                continue;
            }

            const params = {};
            let matched = true;

            for (
                let i = 0;
                i < route.segments.length;
                i++
            ) {
                const routeSegment =
                    route.segments[i];

                const requestSegment =
                    requestSegments[i];

                if (routeSegment.startsWith(":")) {
                    const paramName =
                        routeSegment.slice(1);

                    params[paramName] =
                        decodeURIComponent(
                            requestSegment
                        );

                    continue;
                }

                if (
                    routeSegment !==
                    requestSegment
                ) {
                    matched = false;
                    break;
                }
            }

            if (matched) {
                return {
                    ...route,
                    params
                };
            }
        }

        return null;
    }
}
