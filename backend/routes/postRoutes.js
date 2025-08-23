import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { createPost, deletePost, likeUnlikePost, commentOnPost, deleteComment, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts} from '../controllers/postController.js'

const router = express.Router();

router.post("/create", protectRoute, createPost)
router.delete("/:id", protectRoute, deletePost)
router.post("/like/:postId", protectRoute, likeUnlikePost)
router.post("/comment/:postId", protectRoute, commentOnPost)
router.delete("/comment/:postId/:commentId", protectRoute, deleteComment)
router.get("/all", protectRoute, getAllPosts)
router.get("/liked/:id", protectRoute, getLikedPosts)
router.get("/following", protectRoute, getFollowingPosts)
router.get("/user/:username", protectRoute, getUserPosts)

export default router;