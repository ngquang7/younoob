import { useNavigate, useParams } from 'react-router-dom';
import {useState, useEffect, useRef} from 'react';

export default function YouComponent () {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const [historyList, setHistoryList] = useState<any[]>([]);
    const [likedList, setLikedList] = useState<any[]>([]);
    const [savedList, setSavedList] = useState<any[]>([]);
    const [likedVideoList, setlikedVideoList] = useState<any[]>([]);
    const [isHovered, setIsHovered] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const goChannel = (channelId: string) => navigate(`/channel/${channelId}`);
    const goLikeVideo = () => navigate(`/playlist?list=LL`);

    useEffect(() => {
    //Get string string
        const savedHistory = JSON.parse(localStorage.getItem('watch_history') || '[]');
        setHistoryList(savedHistory);
    }, []);

    useEffect(() => {
        const savedLike = JSON.parse(localStorage.getItem('like_video') || '[]');
        setLikedList(savedLike);
    }, []);

    useEffect(() => {
        const savedSaved = JSON.parse(localStorage.getItem('saved_video') || '[]');
        setSavedList(savedSaved);
    }, []);

    const getView = (view: string) => {
    const totalView: number = Number(view);
    if(totalView < 1000) return `${view}`;
    if(totalView < 1000000) return `${Math.floor(totalView/1000)}K`; //  K views
    if(totalView < 1000000000) return `${Math.floor(totalView/1000000)}M`; // M views
    if(totalView < 1000000000000) return `${Math.floor(totalView/1000000000)}B`; // B views
    }

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
        <div className="w-full mt-1 flex flex-col border-gray-600">
                {/* Profile */}
            <div className="flex items-start gap-3 ml-4 mt-3">
                <img
                src="/public/Q.png"
                    className="w-35 h-35 rounded-full object-cover border border-[#303030]" 
                />
                <div
                    className="flex flex-col items-top"
                >
                    <h1 className="text-4xl font-bold text-white">
                        QuangTeo
                    </h1>
                    <p className="text-gray-400 text-sm mt-3">
                        <span className="font-bold text-white">@ngquang7</span> • View channel
                    </p>
                    {/* whitespace-pre-wrap" */}
                    <div 
                        className="flex items-center gap-3 text-l text-gray-200 mb-1 cursor-pointer w-fit"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <button className="text-gray-400 text-sm mt-3 items-start cursor-pointer">
                            Mr. Quang
                        </button>
                    </div>     
                </div>
            </div>
            {/* 4 rows (HISTORY, PLAYLISTS, WATCH LATER, LIKED VIDEOS) */}
                {/* History */}
                <div className="w-full px-6 mt-1 flex flex-col items-center justify-between border-gray-600">
                    <div className="w-full px-6 mt-1 flex flex-col items-center justify-between border-gray-600">
                        <div className="text-xl font-bold text-white flex flex-row items-center justify-between w-full mt-8 mb-5">
                            <span>History</span>
                            <button 
                                className="text-sm font-semibold text-white cursor-pointer h-[40px] w-[90px] rounded-[20px] border border-gray-300 hover:bg-gray-500"
                                onClick={() => navigate(`/feed/history`)}
                            >
                                View all
                            </button>
                        </div>
                    </div>
                    {/* Video History */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ">
                    {historyList.length > 0 ? (
                        <>
                        {historyList.slice(0, 4).map((video) => (
                        <div 
                            key={video.id} 
                            onClick={() => navigate(`/watch?v=${video.id}`)}
                            className="group rounded-[10px] cursor-pointer hover:bg-[#272727] transition-all"
                        >
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#212121] mb-3">
                                <img
                                    src={video.snippet.thumbnails.medium?.url}
                                    // alt={video.snippet.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                       
                            {/* Details (Avatar, Title, Channel, Stats) PART */}
                            <div className="flex gap-3 px-1">
                                {/* Channel Avatar */}
                                <div className="shrink-0">
                                    <img

                                        src={video.snippet.thumbnails.default?.url}
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
                                            <span className="text-gray-400">{getView(video?.statistics?.viewCount)} views</span>
                                            <span className="mx-1.5 text-[8px]">•</span>
                                            <span className="text-gray-400">{getTimeago(video.snippet.publishedAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    </>
                    ) : (
                        <>
                            <div className="col-span-full text-sm font-semibold text-gray-400 flex flex-col items-center justify-center text-center w-full">       
                                <p>No video yet</p>
                                <p> Save videos to watch later. Your list shows up right here</p>   
                            </div>
                        </>
                    )}
                </div> 
            </div>

            {/* Playlists */}
                <div className="w-full px-6 mt-1 flex flex-col items-center justify-between border-gray-600">
                    <div className="w-full px-6 mt-1 flex flex-col items-center justify-between border-gray-600">
                        <div className="text-xl font-bold text-white flex flex-row items-center justify-between w-full mt-8 mb-5">
                            <span>Playlists</span>
                            <button 
                                className="text-sm font-semibold text-white cursor-pointer h-[40px] w-[90px] rounded-[20px] border border-gray-300 hover:bg-gray-500"
                                onClick={() => navigate(`/feed/playlists`)}
                            >
                                View all
                            </button>
                        </div>
                    </div>
                    {/* Video History */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ">
                    <div 
                        onClick={() => {
                            if(likedList.length > 0) {
                            navigate(`/watch?v=${likedVideoList[0]?.id}&list=LL&start_radio=1`)
                            } else {
                                goLikeVideo();
                            }
                        }}
                        className="group rounded-[10px] cursor-pointer hover:bg-[#272727] transition-all"
                    >
                        <div className="relative group">
                            {/* The layer behind (hiệu ứng chồng layer) */}
                            <div className="absolute -top-4  h-full left-6 right-5 bg-[#3e3e3e] rounded-xl z-0"></div>
                            <div className="absolute -top-2 left-3 right-3 h-full bg-[#656563] rounded-xl z-0"></div>
                            {/* The top layer */}
                            {likedList.length > 0 ? (
                    <>
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#212121] z-10">

                    <img 
                        src={likedList[0]?.snippet?.thumbnails?.medium?.url} 
                        alt={likedList  [0]?.snippet?.title} 
                        className="w-full h-full object-cover rounded-[10px] flex relative cursor-pointer"
                    />
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            {/* Icon Play */}
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M6 4l15 8-15 8z" />
                            </svg>
                            <span className="font-semibold">Play all</span>
                        </div>
                    
                                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22 7H2v1h20V7zm-9 5H2v-1h11v1zm0 4H2v-1h11v1zm7-5v7l6-3.5-6-3.5z"/>
                                    </svg>
                                    <span>{likedList.length} videos</span>
                                </div>
                    </div>
                </>
                ) : (
                    <div 
                        className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#212121] z-10">
                        <img
                            src="/public/loading1.png"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1.5 font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22 7H2v1h20V7zm-9 5H2v-1h11v1zm0 4H2v-1h11v1zm7-5v7l6-3.5-6-3.5z"/>
                            </svg>
                            <span>No videos</span>
                        </div>
                    </div>
                )}
                </div>        
                        <div className="flex gap-3 px-1 mt-2">

                            {/* Title video */}
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                                <h3 
                                className="text-m font-sans font-[600] text-[#f1f1f1] leading-snug line-clamp-2 group-hover:text-white transition-colors duration-200"
                                title='Liked Videos'
                                >
                                    Liked Videos
                                </h3>

                                {/* Mode, Playlist */}
                                <div className="flex items-center text-xs font-sans text-gray-400">
                                    <span className="text-gray-400 font-[500]"> Private</span>
                                    <span className="mx-1.5 text-[8px]">•</span>
                                    <span className="text-gray-400 font-[500]">Playlist</span>
                                </div>

                                <div
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    goLikeVideo();
                                }}
                                className="text-gray-400 text-sm font-[550] hover:text-white z-3">
                                    View full playlist
                                </div>

                            </div>
                        </div> 
                    </div>
                </div> 
            </div>

            {/* Watch Later */}
                <div className="w-full px-6 mt-1 flex flex-col items-center justify-between border-gray-600">
                    <div className="w-full px-6 mt-1 flex flex-col items-center justify-between border-gray-600">
                        <div className="text-xl font-bold text-white flex flex-row items-center justify-between w-full mt-8">
                            <span>Watch later</span>
                            <button 
                                className="text-sm font-semibold text-white cursor-pointer h-[40px] w-[90px] rounded-[20px] border border-gray-300 hover:bg-gray-500"
                                onClick={() => navigate(`/playlist?list=WL`)}
                            >
                                View all
                            </button>
                        </div>
                        <span className="text-sm font-semibold text-gray-400 flex flex-row items-center justify-between w-full mb-5">{savedList.length} videos</span>
                    </div>
                    {/* Video History */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {savedList.length > 0 ? (
                            <>
                            {savedList.slice(0, 4).map((video) => (
                            <div 
                                key={video.id} 
                                onClick={() => navigate(`/watch?v=${video.id}`)}
                                className="group rounded-[10px] cursor-pointer hover:bg-[#272727] transition-all"
                            >
                                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#212121] mb-3">
                                    <img
                                        src={video.snippet.thumbnails.medium?.url}
                                        // alt={video.snippet.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                        
                                {/* Details (Avatar, Title, Channel, Stats) PART */}
                                <div className="flex gap-3 px-1">
                                    {/* Channel Avatar */}
                                    <div className="shrink-0">
                                        <img

                                            src={video.snippet.thumbnails.default?.url}
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
                                                <span className="text-gray-400">{getView(video?.statistics?.viewCount)} views</span>
                                                <span className="mx-1.5 text-[8px]">•</span>
                                                <span className="text-gray-400">{getTimeago(video.snippet.publishedAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                            </>
                    ) : (
                        <>
                        <div className="col-span-full text-sm font-semibold text-gray-400 flex flex-col items-center justify-center text-center w-full">       
                            <p>No video yet</p>
                            <p> Save videos to watch later. Your list shows up right here</p>   
                        </div>
                        </>
                    )} 
                </div> 
            </div>

            {/* LIKED VIDEOS */}
                <div className="w-full px-6 mt-1 flex flex-col items-center justify-between border-gray-600">
                    <div className="w-full px-6 mt-1 flex flex-col items-center justify-between border-gray-600">
                        <div className="text-xl font-bold text-white flex flex-row items-center justify-between w-full mt-8">
                            <span>Liked Videos</span>
                            <button 
                                className="text-sm font-semibold text-white cursor-pointer h-[40px] w-[90px] rounded-[20px] border border-gray-300 hover:bg-gray-500"
                                onClick={() => navigate(`/playlist?list=LL`)}
                            >
                                View all
                            </button>
                        </div>
                        <span className="text-sm font-semibold text-gray-400 flex flex-row items-center justify-between w-full mb-5">{likedList.length} videos</span>
                    </div>
                    
                    {/* Liked Video */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ">
                    {likedList.slice(0, 4).map((video) => (
                        <div 
                            key={video.id} 
                            onClick={() => navigate(`/watch?v=${video.id}&list=LL`)}
                            className="group rounded-[10px] cursor-pointer hover:bg-[#272727] transition-all"
                        >
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#212121] mb-3">
                                <img
                                    src={video.snippet.thumbnails.medium?.url}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                    
                            {/* Details (Avatar, Title, Channel, Stats) PART */}
                            <div className="flex gap-3 px-1">
                                {/* Channel Avatar */}
                                <div className="shrink-0">
                                    <img

                                        src={video.snippet.thumbnails.default?.url}
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
                                            <span className="text-gray-400">{getView(video?.statistics?.viewCount)} views</span>
                                            <span className="mx-1.5 text-[8px]">•</span>
                                            <span className="text-gray-400">{getTimeago(video.snippet.publishedAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> 
            </div>
        </div>
    );
}