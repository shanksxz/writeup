import express from "express";
import { checkAuth, signin, signout, signup } from "../controllers/auth";
import { getUserPosts } from "../controllers/post";
import { auth } from "../middlewares/auth";
const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/signin", signin);
router.get("/auth/me", auth, checkAuth);
router.get("/user/posts", auth, getUserPosts);
router.get("/auth/signout", signout);

export default router;
