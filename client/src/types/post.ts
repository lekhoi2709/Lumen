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

export type TPost = {
  _id?: string;
  title?: string;
  courseId?: string;
  text?: string;
  files?: {
    src: string;
    name: string;
  }[];
  type: PostType;
  createdAt?: string;
  updatedAt?: string;
  dueDate?: string | Date;
  user?: SearchedUserData;
  comments?: TComment[];
};
