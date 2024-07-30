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
    alt: string;
  }[];
  videos?: {
    src: string;
    thumbnail: string;
  }[];
  docs?: {
    src: string;
    title: string;
  }[];
  type: PostType;
  createdAt?: string;
  updatedAt?: string;
  user?: SearchedUserData;
  comments?: TComment[];
};
