import http from "node:http";

import { Request } from "./Request.js";
import { Response } from "./Response.js";
import { Middleware } from "./Middleware.js";
import { Container } from "./Container.js";
import { ControllerResolver } from "./ControllerResolver.js";
import { ValidationException } from "./ValidationException.js";


export class Application {

    constructor(router) {
        this.router = router;
        this.server = null;

        this.container =
            new Container();

        this.controllerResolver =
            new ControllerResolver(
                this.container
            );

        this.middlewares = [];
    }

    use(...middlewares) {
        this.middlewares.push(
            ...middlewares
        );

        return this;
    }

    bind(token, value) {
        this.container.bind(
            token,
            value
        );

        return this;
    }

    singleton(token, value) {
        this.container.singleton(
            token,
            value
        );

        return this;
    }

    make(token) {
        return this.container.make(token);
    }

    listen(port = 3000) {

        this.server =
            http.createServer(
                async (req, res) => {

                    try {

                        const request =
                            new Request(req);

                        const response =
                            new Response(res);

                        const route =
                            this.router.resolve(
                                request.method,
                                request.url
                            );

                        if (!route) {
                            return response
                                .status(404)
                                .send(
                                    "404 Not Found"
                                );
                        }

                        request.setParams(
                            route.params
                        );

                        request.parseQuery();

                        await request.parseBody();

                        const handler =
                            this.controllerResolver
                                .resolve(
                                    route.handler
                                );

                        const middlewareStack = [
                            ...this.middlewares,
                            ...route.middlewares,
                            handler
                        ];

                        await Middleware.run(
                            middlewareStack,
                            request,
                            response
                        );

                    } catch (error) {

                        console.error(error);

                        if (
                            error instanceof ValidationException
                        ) {
                            return response
                                .status(422)
                                .json({
                                    message:
                                        "Validation failed",
                                    errors: error.errors
                                });
                        }

                        if (!res.headersSent) {
                            response
                                .status(500)
                                .json({
                                    message:
                                        "Internal Server Error"
                                });
                        }
                    }

                }
            );

        this.server.listen(
            port,
            () => {
                console.log(
                    `Nexarou running on http://localhost:${port}`
                );
            }
        );
    }
}
