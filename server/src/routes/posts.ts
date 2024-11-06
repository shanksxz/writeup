import express from "express";
const router = express.Router();
import { createPost, deletePost, getPost, getPosts, updatePost } from "../controllers/post";
import { auth } from "../middlewares/auth";
import { upload } from "../middlewares/multer";

router.post("/post/create", auth, upload.single("image"), createPost);

router.get("/post", getPosts);
router.get("/post/:id", auth, getPost);

router.put("/post/:id", auth, upload.single("image"), updatePost);

router.delete("/post/:id", auth, deletePost);

export default router;
