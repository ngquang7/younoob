import { useNavigate, useParams } from 'react-router-dom';
import {useState, useEffect} from 'react';
import {getChannelData} from '../api/channelData';
import {searchYouTube, type YouTubeSearchItem} from "../api/youtubeSearch.ts";

export default function ChannelComponent () {

    const navigate = useNavigate();
    const goWatch = (videoidd: string) => {
        navigate(`/watch?v=${videoidd}`);
    }
    const [isHovered, setIsHovered] = useState(false);  
    const [channel, setChannel] = useState<any>(null); //Channel
    const [channelVideo, setChannelVideo] = useState<YouTubeSearchItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { channelId } = useParams();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    console.log(`${channelId}`);

    useEffect(() => {
        if (!channelId) return;
        const fetchVideo = async () => {
            try {
                const channelIn4 = await getChannelData(channelId);
                const videoChannel = await searchYouTube(undefined, undefined, channelId);
                if(channelIn4.items && channelIn4.items.length > 0) {
                    const channelItem = channelIn4.items[0];
                    setChannel(channelIn4.items);
                }
                setChannelVideo(videoChannel.items);
            } catch (error) {
                console.error("Failed to fetch video:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [channelId]);
    
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

    return(
        <div className="ml-25 flex mr-25 flex-col border-b border-gray-600 pb-3">
            <img
                src={channel?.[0]?.brandingSettings?.image?.bannerExternalUrl || "Loading..."}
                className="w-full h-45 object-cover rounded-2xl"
            />
                <div className="flex gap-4 mt-10 items-start">
                    <img 
                    src={channel?.[0]?.snippet?.thumbnails?.medium?.url} 
                    alt="Channel Avatar" 
                    className="w-40 h-40 rounded-full object-cover border border-[#303030]" 
                    />

                    <div
                        className="flex flex-col items-top"
                    >
                        <h1 className="text-4xl font-bold text-white">
                            {channel?.[0]?.snippet?.title}
                        </h1>
                        <p className="text-gray-400 text-sm mt-3">
                            <span className="font-bold text-white">{channel?.[0]?.snippet?.customUrl}</span> • {channel?.[0]?.statistics?.subscriberCount} subcribers • {channel?.[0]?.statistics?.videoCount} videos
                        </p>
                        {/* whitespace-pre-wrap" */}
                            <div 
                            className="flex items-center gap-3 text-l text-gray-200 mb-1 cursor-pointer w-fit"
                            onClick={() => setIsModalOpen(true)}>
                                <button className="text-gray-400 text-sm mt-3 items-start cursor-pointer">
                                    {channel?.[0]?.brandingSettings?.channel?.description.slice(0,10)} <span className="font-semibold text-l text-white">...more</span>
                                </button>
                            </div>
                       
                    </div>
                    {isModalOpen && (
                        <div 
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        >
                            {/* Khung chứa nội dung bảng (Màu nền tối giống YouTube, có bo góc và cuộn khi dài) */}
                            <div onClick={(e) => e.stopPropagation()} className="bg-[#212121] text-white w-[600px] max-h-[80vh] overflow-y-auto rounded-2xl p-6 shadow-2xl relative border border-gray-700 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#555] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                                {/* Nút Đóng (Dấu X góc trên bên phải) */}
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl p-2 rounded-full cursor-pointer hover:bg-gray-700 transition"
                                >
                                    ✕
                                </button>

                                {/* Tiêu đề kênh trong bảng */}
                                <h2 className="text-xl font-bold mb-6">
                                    {channel?.[0]?.snippet?.title}
                                </h2>

                                {/* Mục Description */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-base mb-2">Description</h3>
                                    {/* whitespace-pre-wrap giúp giữ nguyên các khoảng xuống dòng của mô tả gốc */}
                                    <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                                        {channel?.[0]?.brandingSettings?.channel?.description || channel?.[0]?.snippet?.description}
                                    </p>
                                </div>

                                {/* Các thông tin phụ bên dưới (Sub, Video count, Custom URL...) */}
                                <div className="border-t border-gray-700 pt-4 space-y-3 text-sm text-gray-300">
                                    <div className="flex items-center gap-3">
                                        <span>🔗</span>
                                        <span>{channel?.[0]?.snippet?.customUrl}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span>👥</span>
                                        <span>{channel?.[0]?.statistics?.subscriberCount} subscribers</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span>🎬</span>
                                        <span>{channel?.[0]?.statistics?.videoCount} videos</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span>📅</span>
                                        <span>Joined {new Date(channel?.[0]?.snippet?.publishedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
</div>


<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
    {channelVideo && channelVideo.map((video: YouTubeSearchItem) => (
        <div
            className="flex flex-col gap-3 group cursor-pointer transition-all duration-300 w-full hover:bg-[#272727]"
            onClick={() => {
                if (video.id.videoId) {
                    goWatch(video.id.videoId);
                }
            }}      
        >

            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#212121] transition-shadow duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img
                src={video.snippet.thumbnails.medium?.url}
                // alt={video.snippet.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
                
                {/* Video duration */}
                {/* <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[11px] font-sans font-medium text-white tracking-wide border border-white/5">
                    video duration
                </span> */}
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
                    a.
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
            )
            )}
        </div>
        </div>
        

        
            
        
    );

}