import type {YouTubeSearchItem, YouTubeVideo}  from "../type";
// Interface
interface VideoGridProps {
  video: YouTubeSearchItem;
}
export default function VideoGrid ( {video}: VideoGridProps) {



    return (
    <div
      className="flex flex-col gap-3 group cursor-pointer transition-all duration-300 w-full"
    >
      {/* Thumbnail with overlay duration */}
      {/* adjust size here --------------------
                                              | */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#212121] transition-shadow duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
        <img
          src={video.snippet.thumbnails.medium?.url}
          alt={video.snippet.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[11px] font-sans font-medium text-white tracking-wide border border-white/5">
          video duration
        </span>
      </div>

      {/* Details (Avatar, Title, Channel, Stats) */}
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

        {/* Text descriptions */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h3 className="text-sm font-sans font-semibold text-[#f1f1f1] leading-snug line-clamp-2 group-hover:text-white transition-colors duration-200">
            {video.snippet.title}
          </h3>
          
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-sans text-gray-400 hover:text-[#f1f1f1] transition-colors truncate">
              {video.snippet.channelTitle}
            </span>
            
            <div className="flex items-center text-xs font-sans text-gray-400">
              <span className="text-gray-400">.</span>
              <span className="mx-1.5 text-[8px]"></span>
              <span>view</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}