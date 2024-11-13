import express from "express";
import { createComment, getAllComments } from "../controllers/comments";
import { auth } from "../middlewares/auth";
const router = express.Router();

// router.post("/comment/create", auth, createComment);
// router.get("/comment/:postId", auth, getAllComments);
// router.post("/comment/:commentId/like", auth);

router.post("/:postId/comment", auth, createComment);
router.get("/:postId/comment", auth, getAllComments);

export default router;
