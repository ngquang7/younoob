
interface VideoSnippet {
    title: string;
    channelId: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
        medium?: { url: string };
        default?: { url: string };
    };
}

interface VideoStatistics {
    viewCount?: string | number;
}

export interface VideoItem {
    id: string | number;
    snippet: VideoSnippet;
    statistics?: VideoStatistics;
}

interface VideoCardProps {
    video: VideoItem;
    navigate: (path: string) => void;
    goChannel: (channelId: string) => void;
    formatView?: (count: string | number) => string | undefined;
    formatTimeAgo?: (date: string) => string;
}

export default function VideoCard({ 
    video, 
    navigate, 
    goChannel,
    formatView = (val) => String(val || 0),
    formatTimeAgo = (val) => val,
    
}: VideoCardProps) {

    
    return (
        <div 
            onClick={() => navigate(`/watch?v=${video.id}`)}
            className="group rounded-[10px] cursor-pointer hover:bg-[#272727] transition-all"
        >
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#212121] mb-3">
                <img
                    src={video.snippet.thumbnails.medium?.url}
                    alt={video.snippet.title}
                    className="w-full h-full object-cover"
                />
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
                        <span 
                            onClick={(e) => {
                                e.stopPropagation();
                                goChannel(video.snippet.channelId);
                            }}
                            className="text-xs font-sans text-gray-400 hover:text-[#f1f1f1] transition-colors truncate"
                        >
                            {video.snippet.channelTitle}
                        </span>
                        
                        {/* View */}
                        <div className="flex items-center text-xs font-sans text-gray-400">
                            <span className="text-gray-400">{formatView(video?.statistics?.viewCount || "")} views</span>
                            <span className="mx-1.5 text-[8px]">•</span>
                            <span className="text-gray-400">{formatTimeAgo(video.snippet.publishedAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}