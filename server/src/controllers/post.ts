import type { Request, Response } from "express";
import { z } from "zod";
import { uploadOnCloudinary } from "../config/cloudinary";
import { Post } from "../models";
import type { PaginationQuery } from "../types";
import { postSchema, type postSchemaType } from "../validators";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = postSchema.parse(req.body);
    const author = req.user.id;
    let imageUrl = null;
    let publicId = null;

    if (req.file) {
      const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (result) {
        imageUrl = result.secure_url;
        publicId = result.public_id;
      }
    }

    const post = await Post.create({
      title,
      content,
      image: imageUrl,
      imagePublicId: publicId,
      author,
    });
    res.status(201).json({ post });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { title, content } = postSchema.parse(req.body);
    const updateData: postSchemaType & {
      image?: string | null;
      imagePublicId?: string;
    } = { title, content };

    const existingPost = await Post.findById(req.params.id);
    if (!existingPost) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    if (req.file) {
      const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (result) {
        updateData.image = result.secure_url;
        updateData.imagePublicId = result.public_id;
      }
    }

    const post = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.status(200).json({ post });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPosts = async (req: Request<{}, {}, {}, PaginationQuery>, res: Response) => {
  try {
    if (!req.query.page || !req.query.limit) {
      res.status(400).json({ error: "Please provide page and limit query parameters" });
      return;
    }

    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await Post.find().populate("author", "username").sort({ createdAt: -1 }).skip(skipIndex).limit(limit);

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserPosts = async (req: Request<{}, {}, {}, PaginationQuery>, res: Response) => {
  try {
    if (!req.query.page || !req.query.limit) {
      res.status(400).json({ error: "Please provide page and limit query parameters" });
      return;
    }

    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    const totalPosts = await Post.countDocuments({ author: req.user.id });
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await Post.find({ author: req.user.id })
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(limit);

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username");
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.status(200).json({ post });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
