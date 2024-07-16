export type Course = {
  classCode?: string;
  title: string;
  description?: string;
  price?: number;
  instructor: {
    name: string;
    email: string;
  };
  image?: string;
  students: Array<{
    name: string;
    email: string;
  }>;
};
