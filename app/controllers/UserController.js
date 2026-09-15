export class UserController {

    constructor(userService) {
        this.userService = userService;
    }

    async store(req, res) {

        const data = await req.validate({
            name: "required|string|min:3",
            email: "required|email",
            age: "required|integer|min:18"
        });

        const user =
            this.userService.create(data);

        return res
            .status(201)
            .json({
                message: "User created",
                user
            });
    }
}
