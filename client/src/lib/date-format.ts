const dateFormat = (date: Date) => {
  const now = new Date();
  const isCurrentYear = date.getFullYear() === now.getFullYear();
  const isCurrentDate = date.toDateString() === now.toDateString();

  if (isCurrentDate) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } else if (isCurrentYear) {
    const currentMonth = (date.getMonth() + 1).toString().padStart(2, "0");
    const currentDate = date.getDate().toString().padStart(2, "0");
    return `${currentDate}-${currentMonth}`;
  } else {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${day}-${month}-${year}`;
  }
};

export default dateFormat;
