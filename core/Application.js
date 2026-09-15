import http from "node:http";
import { Request } from "./Request.js";
import { Response } from "./Response.js";
import { Middleware } from "./Middleware.js";

export class Application {
    constructor(router) {
        this.router = router;
        this.server = null;
        this.middlewares = [];
    }

    use(...middlewares) {
        this.middlewares.push(
            ...middlewares
        );

        return this;
    }

    listen(port = 3000) {
        this.server = http.createServer(
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
                            .send("404 Not Found");
                    }

                    request.setParams(
                        route.params
                    );

                    await request.parseBody();

                    const middlewareStack = [
                        ...this.middlewares,
                        ...route.handlers
                    ];

                    await Middleware.run(
                        middlewareStack,
                        request,
                        response
                    );

                } catch (error) {
                    console.error(error);

                    if (!res.headersSent) {
                        res.writeHead(500, {
                            "Content-Type":
                                "application/json"
                        });

                        res.end(
                            JSON.stringify({
                                message:
                                    "Internal Server Error"
                            })
                        );
                    }
                }
            }
        );

        this.server.listen(port, () => {
            console.log(
                `Nexarou running on http://localhost:${port}`
            );
        });
    }
}
