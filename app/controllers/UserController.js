export class UserController {

    constructor(userService) {
        this.userService = userService;
    }

    async index(req, res) {
        const users =
            this.userService.getUsers();

        res.json(users);
    }

    async show(req, res) {
        const user =
            this.userService.getUser(
                req.params.id
            );

        res.json(user);
    }
}
