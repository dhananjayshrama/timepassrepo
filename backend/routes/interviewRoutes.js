import { Router } from "express";
import { startInterview, submitAnswer, getResult } from "../controllers/interviewController.js";

const router = Router();

router.get("/ping", (req, res) => {
  res.json({ message: "interview routes working" });
});

router.post("/start", startInterview);
router.post("/answer", submitAnswer);
router.get("/result/:sessionId", getResult);

export default router;