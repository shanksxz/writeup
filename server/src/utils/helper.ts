import type { Response } from "express";
import jwt from "jsonwebtoken";
import mongoose, { type PipelineStage } from "mongoose";
import { ZodError } from "zod";
import { JWT_SECRET } from "../config/config";
import type { Post } from "../models";
import type { UserResponse } from "../types";
import type { ValidatedSearchQuery } from "../validators";
import ApiError from "./apiError";

export function handleControllerError(error: unknown, res: Response) {
  console.error("Controller error:", error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: error.errors,
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    error: "An unexpected error occurred",
  });
}

export function buildSearchQuery(params: ValidatedSearchQuery): mongoose.FilterQuery<typeof Post> {
  const query: any = {};

  if (params.search) {
    query.$text = { $search: params.search };
  }

  if (params.category) {
    query.categories = new mongoose.Types.ObjectId(params.category);
  }

  if (params.author) {
    query.author = new mongoose.Types.ObjectId(params.author);
  }

  if (params.status) {
    query.status = params.status;
  }

  if (params.startDate || params.endDate) {
    query.createdAt = {};
    if (params.startDate) {
      query.createdAt.$gte = new Date(params.startDate);
    }
    if (params.endDate) {
      query.createdAt.$lte = new Date(params.endDate);
    }
  }

  if (params.minLikes) {
    query.likeCount = { $gte: params.minLikes };
  }

  return query;
}

export function buildAggregationPipeline(query: any, params: ValidatedSearchQuery): PipelineStage[] {
  const skip = (params.page - 1) * params.limit;

  return [
    { $match: query },
    {
      $facet: {
        posts: [
          { $sort: { [params.sortBy]: params.sortOrder === "asc" ? 1 : -1 } },
          { $skip: skip },
          { $limit: params.limit },
          {
            $lookup: {
              from: "users",
              localField: "author",
              foreignField: "_id",
              pipeline: [{ $project: { username: 1, firstName: 1, lastName: 1 } }],
              as: "author",
            },
          },
          { $unwind: "$author" },
          {
            $lookup: {
              from: "categories",
              localField: "categories",
              foreignField: "_id",
              pipeline: [{ $project: { name: 1 } }],
              as: "categories",
            },
          },
        ],
        pagination: [
          { $count: "total" },
          {
            $addFields: {
              currentPage: params.page,
              totalPages: {
                $ceil: {
                  $divide: ["$total", params.limit],
                },
              },
              hasNextPage: {
                $lt: [params.page, { $ceil: { $divide: ["$total", params.limit] } }],
              },
              hasPrevPage: { $gt: [params.page, 1] },
            },
          },
        ],
        stats: [
          {
            $group: {
              _id: null,
              avgLikes: { $avg: "$likeCount" },
              totalLikes: { $sum: "$likeCount" },
              totalComments: { $sum: "$commentsCount" },
            },
          },
        ],
      },
    },
  ] as PipelineStage[];
}

export const generateToken = (res: Response, userId: string) => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
};

export const formatUserResponse = (user: any): UserResponse => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  username: user.username,
  email: user.email,
  role: user.role,
  bio: user.bio,
  website: user.website,
  socialLinks: user.socialLinks,
  isEmailVerified: user.isEmailVerified,
});
