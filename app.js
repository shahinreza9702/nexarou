import { Application } from "./core/Application.js";
import { Router } from "./core/Router.js";

import { UserController } from "./controllers/UserController.js";
import { UserService } from "./services/UserService.js";

const router = new Router();

const app = new Application(router);

app.singleton(
    "UserService",
    () => new UserService()
);

const userService =
    app.make("UserService");

const userController =
    new UserController(userService);

router.get(
    "/users",
    userController.index.bind(userController)
);

router.get(
    "/users/:id",
    userController.show.bind(userController)
);

app.listen(3000);
