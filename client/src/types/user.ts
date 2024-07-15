export type User = {
  email: string;
  role: "Student" | "Teacher" | "Admin";
  avatarUrl: string;
  firstName: string;
  lastName: string;
};
