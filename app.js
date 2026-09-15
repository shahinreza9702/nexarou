import { Application } from "./core/Application.js";
import { Router } from "./core/Router.js";

import { UserController } from "./controllers/UserController.js";

const router = new Router();

router.get(
    "/users",
    UserController.index
);

router.get(
    "/users/:id",
    UserController.show
);

router.post(
    "/users",
    UserController.store
);

const app = new Application(router);

app.listen(3000);
