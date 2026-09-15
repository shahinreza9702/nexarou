import http from "node:http";
import { Request } from "./Request.js";
import { Response } from "./Response.js";

export class Application {
    constructor(router) {
        this.router = router;
        this.server = null;
    }

    listen(port = 3000) {
        this.server = http.createServer(
            async (req, res) => {
                const request = new Request(req);
                const response = new Response(res);

                const route = this.router.resolve(
                    request.method,
                    request.url
                );

                if (!route) {
                    return response.status(404).send("404 Not Found");
                }

                await route.handler(
                    request,
                    response
                );
            }
        );

        this.server.listen(port, () => {
            console.log(
                `Nexarou running on http://localhost:${port}`
            );
        });
    }
}
