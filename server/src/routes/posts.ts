import express from "express";
const router = express.Router();
import { createPost, deletePost, getPost, getPosts, likePost, searchPosts, updatePost } from "../controllers/post";
import { auth } from "../middlewares/auth";
import { upload } from "../middlewares/multer";

router.post("/", auth, upload.single("image"), createPost);
router.get("/", getPosts);
router.get("/:id", auth, getPost);
router.put("/:id", auth, upload.single("image"), updatePost);
router.delete("/:id", auth, deletePost);
router.post("/:postId/like", auth, likePost);
router.get("/search", searchPosts);

export default router;
