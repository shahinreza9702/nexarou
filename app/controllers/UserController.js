export class UserController {

    static async index(req, res) {
        res.json([
            {
                id: 1,
                name: "Rahim"
            },
            {
                id: 2,
                name: "Karim"
            }
        ]);
    }

    static async show(req, res) {
        const id = req.params.id;

        res.json({
            id,
            name: "Rahim"
        });
    }

     static async store(req, res) {

        console.log(req.body);

        res.status(201).json({
            message: "User created",
            data: req.body
        });
    }
}
