export class Middleware {
    static async run(stack, req, res) {
        let index = -1;

        const next = async () => {
            index++;

            const handler = stack[index];

            if (!handler) {
                return;
            }

            await handler(req, res, next);
        };

        await next();
    }
}
