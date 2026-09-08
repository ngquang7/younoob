export const formatDateTime = (date: string) => {
    if (!date) return '';
    const videoDate = new Date(date);
    const dayandmonth: string = videoDate.toDateString().slice(4, 10);
    const year: string = videoDate.toDateString().slice(11, 16);
    return `${dayandmonth}, ${year}`;
  };