import { Application } from "./core/Application.js";
import { Router } from "./core/Router.js";

import { UserController } from "./controllers/UserController.js";
import { UserService } from "./services/UserService.js";

const router = new Router();

const app = new Application(router);

app.singleton(
    UserService,
    UserService
);

router.get(
    "/users",
    [UserController, "index"]
);

router.get(
    "/users/:id",
    [UserController, "show"]
);

app.listen(3000);
