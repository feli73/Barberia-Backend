import Router from "express";
import mailController from "../controllers/mailController.js";

const router = Router();


router.post("/", mailController.sendMail);



export default router;