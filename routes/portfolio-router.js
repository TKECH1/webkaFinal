import {Router} from "express";
import PortfolioController from "../controllers/portfolio-controller.js";
import {requireAuth, requireAdmin} from "../utils/auth-middleware.js"

const portfolioController = new PortfolioController()
const router = new Router()

router.get("/", requireAuth, await portfolioController.getAllProjects)
router.get("/project/:id", requireAuth, await portfolioController.getProjectById)

router.get("/create", requireAdmin, requireAuth, await portfolioController.projectCreationPage)
router.post("/create", requireAdmin, requireAuth, await portfolioController.createProject)

router.get("/update/project/:id", requireAdmin, requireAuth, await portfolioController.projectUpdatePage)
router.put("/update/project/:id", requireAdmin, requireAuth, await portfolioController.updateProject)
router.delete("/delete/project/:id", requireAdmin, requireAuth, await portfolioController.deleteProject)

export default router