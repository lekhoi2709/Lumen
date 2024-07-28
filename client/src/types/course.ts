import { SearchedUserData } from "./user";

export type Course = {
  _id?: string;
  title: string;
  description?: string;
  price?: number;
  image?: string;
  createdAt?: Date;
  createdUserEmail?: string;
};

export type CoursePeople = {
  instructors: SearchedUserData[];
  students: SearchedUserData[];
};

export type AddCoursePeopleType = {
  users: SearchedUserData[];
  type: "ins" | "stu";
  id: string;
};
