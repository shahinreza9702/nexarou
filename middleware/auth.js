export async function auth(req, res, next) {
    const token = req.header(
        "authorization"
    );

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    await next();
}
