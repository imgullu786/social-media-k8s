import Post from '../models/post.js'
import User from '../models/user.js'
import Notification from '../models/notification.js'
import {v2 as cloudinary} from 'cloudinary';

export const createPost = async (req, res) => {
    try {
        const {text} = req.body;
        let {img} = req.body;
        const userId = req.user._id.toString();

        if(!text && !img){
            return res.status(400).json({error : "Post can't be empty"})
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error : "User not found"})
        }
        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            userId,
            text,
            img,
        });
        await newPost.save();
        return res.status(201).json({newPost});
    } catch (error) {
        console.log("error in createPost controller : ", error.message);
        res.status(500).json({error : "Internal server error"});
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({error : "Post not found"});
        }
        if(post.userId.toString() !== req.user._id.toString()){
            return res.status(403).json({error : "You are not authorized to delete this post"});
        }
        if(post.img){
            const imgIdResponse = post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgIdResponse);
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message : "Post deleted successfully"});
    } catch (error) {
        console.log("error in deletePost route : ", error.message);
        res.status(500).json({error : "Internal server error"});
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error : "Post not found"});
        }
        const {text} = req.body;
        if(!text){
            return res.status(400).json({error : "Comment can't be empty"});
        }
        // add comment to post
        const comment = {
            text,
            postedBy : userId,
        }
        post.comments.push(comment);
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.log("error in commentOnPost route : ", error.message);
        res.status(500).json({error : "Internal server error"});
    }
}

export const deleteComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error : "Post not found"});
        }
        const comment = post.comments.find((comment) => comment._id.toString() === commentId.toString());
        if(!comment){
            return res.status(404).json({error : "Comment not found"});
        }
        if(comment.postedBy.toString() !== req.user._id.toString()){
            return res.status(403).json({error : "You are not authorized to delete this comment"});
        }
        post.comments = post.comments.filter((comment) => comment._id.toString() !== commentId.toString());
        await post.save();
        const updatedComments = post.comments;
        res.status(200).json(updatedComments);
    } catch (error) {
        console.log("error in deleteComment route : ", error.message);
        res.status(500).json({error : "Internal server error"});
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error : "Post not found"});
        }
        const likedPost = post.likes.includes(userId);
        if(likedPost){
            // unlike the post
            await Post.findByIdAndUpdate(postId, {$pull: {likes: userId}});
            await User.findByIdAndUpdate(userId, {$pull: {likedPosts: postId}});
            // get updated likes array in response
            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes);
            // res.status(200).json({message : "Post unliked successfully"});
        }else{
            // like the post
            post.likes.push(userId);
            post.save();
            await User.findByIdAndUpdate(userId, {$push: {likedPosts: postId}});
            // send notification to the user
            const newNotification = new Notification({
                from: userId,
                to: post.userId,
                type: "like"
            });
            await newNotification.save();
            // get updated likes array in response
            const updatedLikes = post.likes;
            res.status(200).json(updatedLikes);
            // res.status(200).json({message : "Post liked successfully"});
        }
    } catch (error) {
        console.log("error in likeUnlikePost route : ", error.message);
        res.status(500).json({error : "Internal server error"});
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1}).populate({
            path: "userId",
            select: "-password",
        }).populate({
            path: "comments.postedBy",
            select: "-password",
        })
        if(!posts){
            return res.status(404).json({error : "No posts found"});
        }
        res.status(200).json(posts);
    } catch (error) {
        console.log("error in getAllPosts route : ", error.message);
        res.status(500).json({error : "Internal server error"});
    }
}

export const getLikedPosts = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error : "User not found"});
        }
        const likedPosts = await Post.find({likes: userId}).populate({
            path: "userId",
            select: "-password",
        }).populate({
            path: "comments.postedBy",
            select: "-password",
        })
        res.status(200).json(likedPosts);
    } catch (error) {
        console.log("error in getLikedPosts route : ", error.message);
        res.status(500).json({error : "Internal server error"});
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const followingUser = user.following;
        const followingPosts = await Post.find({userId: {$in: followingUser}}).sort({createdAt: -1}).populate({
            path: "userId",
            select: "-password",
        }).populate({
            path: "comments.postedBy",
            select: "-password",
        })
        res.status(200).json(followingPosts);       
    } catch (error) {
        console.log("error in getFollowingPosts route : ", error.message);
        res.status(500).json({error : "Internal server error"});       
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({username});
        const userPost = await Post.find({userId: user._id}).sort({createdAt: -1}).populate({
            path: "userId",
            select: "-password",
        }).populate({
            path: "comments.postedBy",
            select: "-password",
        })
        res.status(200).json(userPost);
    } catch (error) {
        console.log("error in getUserPosts route : ", error.message);
        res.status(500).json({error : "Internal server error"});       
    }
}