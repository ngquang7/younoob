import type {YouTubeSearchItem, YouTubeVideo}  from "../type";
import {useState} from 'react';
// Interface
interface VideoGridProps {
  video: YouTubeSearchItem;
  goWatch: (videoId: string) => void;
}
export default function VideoGrid ( {video, goWatch}: VideoGridProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getTimeago = (date: string) => {
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

  return (
    <div
      className="flex flex-col gap-3 group cursor-pointer transition-all duration-300 w-full hover:bg-[#272727]"
      onClick={() => {
        if (video.id.videoId) {
          goWatch(video.id.videoId);
        }
      }}
      >
      {/* Thumbnail with overlay duration */}
      {/* adjust size here --------------------
                                              | */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#212121] transition-shadow duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
        {isHovered ? (
          <iframe
            className="w-full h-full pointer-events-none"
            //mute=1 -> mute
            src={`https://www.youtube.com/embed/${video.id.videoId}?autoplay=1&mute=0&controls=0&modestbranding=1`}
            title="YouTube video preview"
            allow="autoplay"
          />
        ) : (
          <img
            src={video.snippet.thumbnails.medium?.url}
            // alt={video.snippet.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
          )}
          {/* Video duration */}
            {/* <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[11px] font-sans font-medium text-white tracking-wide border border-white/5">
              video duration
            </span> */}
      </div>

      {/* Details (Avatar, Title, Channel, Stats) PART */}
      <div className="flex gap-3 px-1">
        {/* Channel Avatar */}
        <div className="shrink-0">
          <img
            src={video.snippet.thumbnails.default?.url}
            alt={video.snippet.channelTitle}
            className="w-9 h-9 rounded-full object-cover border border-[#303030] hover:ring-2 hover:ring-white/10 transition-all"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Title video */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h3 className="text-sm font-sans font-semibold text-[#f1f1f1] leading-snug line-clamp-2 group-hover:text-white transition-colors duration-200">
            {video.snippet.title}
          </h3>
          
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-sans text-gray-400 hover:text-[#f1f1f1] transition-colors truncate">
              {video.snippet.channelTitle}
            </span>
            {/* View */}
            <div className="flex items-center text-xs font-sans text-gray-400">
              <span className="text-gray-400">view</span>
              <span className="mx-1.5 text-[8px]">•</span>
              <span className="text-gray-400">{getTimeago(video.snippet.publishedAt)}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}