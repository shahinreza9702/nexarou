export class UserService {

    getUsers() {
        return [
            {
                id: 1,
                name: "Rahim"
            },
            {
                id: 2,
                name: "Karim"
            }
        ];
    }

    getUser(id) {
        return {
            id,
            name: "Rahim"
        };
    }
}
