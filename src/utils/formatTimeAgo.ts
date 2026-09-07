export const formatTimeAgo = (date: string) => {
    const videoDate = new Date(date);
    const currentTime = new Date();
    const timeAgo = Math.floor((currentTime.getTime() - videoDate.getTime()) / 1000);
    if(timeAgo < 60) return `${timeAgo} seconds ago`; //SECOND
    if (timeAgo < 3600) { // MINUTE
      const minutes = Math.floor(timeAgo / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } 
    if (timeAgo < 86400) { // HOUR
      const hours = Math.floor(timeAgo/3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } 
    if (timeAgo < 604800) { // DAY
      const days = Math.floor(timeAgo / 86400);
      return `${days} day${days > 1 ? 's' : '' } ago`;
    } 
    if (timeAgo < 2592000) { // WEEK
      const weeks = Math.floor(timeAgo / 604800);
      return `${weeks} week${weeks > 1 ? 's' : '' } ago`;
    } 
    if (timeAgo < 31536000) { // MONTH
      const months = Math.floor(timeAgo / 2592000);
      return `${months} month${months > 1 ? 's' : '' } ago`;
    }  
     //YEAR
    const years = Math.floor(timeAgo / 31536000);
    return `${years} year${years > 1 ? 's' : '' } ago`;
  }
