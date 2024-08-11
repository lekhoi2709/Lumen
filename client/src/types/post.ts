import { SearchedUserData } from "./user";

export type TComment = {
  _id?: string;
  text: string;
  createdAt?: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
  };
};

export enum PostType {
  Post = "Post",
  Assignment = "Assignment",
}

type BasePostType = {
  _id?: string;
  courseId?: string;
  text?: string;
  files?: {
    src: string;
    name: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
  user?: SearchedUserData;
  comments?: TComment[];
};

export type TPost = BasePostType & {
  type: PostType.Post;
};

export type TAssignment = BasePostType & {
  title: string;
  type: PostType.Assignment;
  dueDate?: string | Date;
  grades?: {
    user: SearchedUserData;
    grade: number;
  }[];
  submissions?: {
    user: SearchedUserData;
    files: {
      src: string;
      name: string;
    }[];
  }[];
};

export type TUnionPost = TPost | TAssignment;
