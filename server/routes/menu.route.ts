import express from "express" 
import upload from "../middlewares/multer";
import {isAuthenticated} from "../middlewares/isAuthenticated";
import { addMenu, editMenu, getMenu, deleteMenu } from "../controller/menu.controller";

const router = express.Router();

router.route("/").get(isAuthenticated, getMenu);
router.route("/").post(isAuthenticated, upload.any(), addMenu);
router.route("/:id").put(isAuthenticated, upload.any(), editMenu);
router.route("/:id").delete(isAuthenticated, deleteMenu);
 
export default router;