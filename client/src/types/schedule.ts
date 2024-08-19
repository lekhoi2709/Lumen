export type Schedule = {
  _id: string;
  courseId: {
    title: string;
  };
  instructorEmail: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
};

export type Assignment = {
  _id: string;
  title: string;
  dueDate: string;
  courseId: string;
};
