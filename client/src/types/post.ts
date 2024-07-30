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
  Text = "Text",
  Image = "Image",
  Video = "Video",
  Document = "Document",
  Mixed = "Mixed",
}

export type TPost = {
  _id?: string;
  text?: string;
  images?: {
    src: string;
    name: string;
  }[];
  videos?: {
    src: string;
    name: string;
  }[];
  documents?: {
    src: string;
    name: string;
  }[];
  type: PostType;
  createdAt?: string;
  updatedAt?: string;
  user?: SearchedUserData;
  comments?: TComment[];
};
