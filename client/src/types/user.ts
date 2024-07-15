export type User = {
  email: string;
  password?: string;
  role: "Student" | "Teacher" | "Admin";
  avatarUrl: string;
  firstName: string;
  lastName: string;
};

export type Profile = {
  user?: User;
  token: string;
  refreshToken?: string;
};
