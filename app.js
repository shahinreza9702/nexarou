import { Application } from "./core/Application.js";
import { Router } from "./core/Router.js";

const router = new Router();

router.get("/", (req, res) => {
    res.send("Home Page");
})

router.get("/users", (req, res) => {
    res.json([
        {
            id: 1,
            name: "Rahim"
        }
    ]);
})

const app = new Application(router);

app.listen(3000);