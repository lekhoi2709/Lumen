export type User = {
  email: string;
  password?: string;
  role: "Student" | "Teacher" | "Admin";
  avatarUrl: string;
  firstName: string;
  lastName: string;
  courses?: {
    code: string;
    role: string;
  }[];
};

export type Profile = {
  user?: User;
  token: string;
  refreshToken?: string;
};

export type SearchedUserType = {
  users: SearchedUserData[];
  message: string;
};

export type SearchedUserData = {
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
};
