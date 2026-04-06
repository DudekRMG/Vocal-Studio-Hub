import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import voiceRangeRouter from "./voice-range";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(voiceRangeRouter);

export default router;
