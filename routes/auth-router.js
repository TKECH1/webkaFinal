import {Router} from "express";
import AuthController from "../controllers/auth-controller.js";

const authController = new AuthController()
const router = new Router()

router.get("/registration", await authController.registrationPage)
router.get("/login", await authController.loginPage)

router.post("/registration", await authController.registration)
router.post("/login", await authController.login)

export default router