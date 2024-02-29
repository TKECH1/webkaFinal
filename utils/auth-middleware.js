import UserService from "../services/user-service.js";

const userService = new UserService()

export function requireAuth(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect("/auth/login");
}

export const requireAdmin = async (req, res, next) => {
    try {
        if (req.session && req.session.userId) {
            const user = await userService.findById(req.session.userId);
            console.log("User role:", user.role);

            if (user && user.role === 'ADMIN') {
                return next();
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error checking user role');
    }
};