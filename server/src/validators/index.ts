import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(3).max(255),
  lastName: z.string().min(3).max(255),
  username: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

export const postSchema = z.object({
  title: z.string().min(3).max(255),
  content: z.string().min(3),
});

export const commentSchema = z.object({
  content: z.string().min(2),
  postId: z.string().uuid().optional(),
  parentCommentId: z.string().uuid().optional(),
});

export type commentSchemaType = z.infer<typeof commentSchema>;
export type postSchemaType = z.infer<typeof postSchema>;
export type userSchemaType = z.infer<typeof userSchema>;
