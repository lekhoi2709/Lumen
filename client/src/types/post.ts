import { SearchedUserData } from "./user";

export type TComment = {
  _id?: string;
  text: string;
  createdAt?: string;
  user: SearchedUserData;
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

type TGrade = {
  by: SearchedUserData;
  comment: string;
  value: number;
  max: number;
};

export type SubmitAssignmentType = {
  _id?: string;
  user: SearchedUserData;
  files: {
    src: string;
    name: string;
  }[];
  grade?: TGrade;
  createdAt?: string;
};

export type TAssignment = BasePostType & {
  title: string;
  type: PostType.Assignment;
  dueDate?: string | Date;
  submissions?: SubmitAssignmentType[];
};

export type TUnionPost = TPost | TAssignment;
