export type Course = {
  _id?: string;
  title: string;
  description?: string;
  price?: number;
  instructor?: {
    name: string;
    email: string;
    avatarUrl: string;
  };
  image?: string;
  instructors?: Array<{
    name: string;
    email: string;
    avatarUrl: string;
  }>;
  students?: Array<{
    name: string;
    email: string;
    avatarUrl: string;
  }>;
};
