import {useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LikedVideoComponent () {
    const [likedVideoList, setlikedVideoList] = useState<any[]>([]);
    const navigate = useNavigate();

    // Load like_video when go to this page
    useEffect(() => {
        const savedLikedVideo = JSON.parse(localStorage.getItem('like_video') || '[]');
        setlikedVideoList(savedLikedVideo);
    }, []);

    const getTotalLikedVideo = likedVideoList.length;
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
    <>
        <div className="flex items-start gap-6 p-6">  
            {/* Left */}
            <aside className="fixed ml-65 mb-5 left-0 top-18 bottom-0 w-100 bg-zinc-900 z-40 border-r border-zinc-800 rounded-[15px]">
                {likedVideoList.length > 0 ? (
                <>
                <div className="absolute inset-0 overflow-hidden rounded-xl ">
                    <img
                        src={likedVideoList[0]?.snippet?.thumbnails?.medium?.url}
                        className="absolute inset-0 w-full h-full object-cover filter blur-lg opacity-60 pointer-events-none"
                    />
                    </div>
                    {/* Darker background */}
                    <div className="absolute inset-0 bg-black/30"></div>
                    <img 
                        src={likedVideoList[0]?.snippet?.thumbnails?.medium?.url} 
                        alt={likedVideoList[0]?.snippet?.title} 
                        className="ml-5 w-90 h-50 mt-5 object-cover rounded-[10px] z-10 flex relative cursor-pointer hover:brightness-40 transition duration-300"
                        onClick={() => navigate(`/watch?v=${likedVideoList[0]?.id}`)}
                    />
                    <h1 className="text-2xl font-bold font-sans mt-5 ml-5 z-10 flex relative">Liked Videos</h1>                
                    <p className="text-l font-bold font-sans mt-5 ml-5 z-10 flex relative">Quang playList</p>
                    <p className="text-m text-gray-400 mt-1 ml-5 z-10 flex relative">{getTotalLikedVideo} videos</p>
                </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 bg-gradient-to-b from-[#5c241c] via-[#241517] to-[#121212]">
                        No thumbnail
                    </div>
                )}
            </aside>

            {/* Right */}
            <div className="flex-1 ml-100 flex flex-col h-1000 gap-4">
                {likedVideoList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-2">
                <p className="text-lg font-medium">You have no liked video yet.</p>
                <p className="text-sm">Videos you like will show up here so you can easily find them again.</p>
                </div>
                ) : (
                /* Video in column */
                <div className="flex flex-col gap-3">
                {likedVideoList.map((video) => (
                    <div 
                    key={video.id} 
                    onClick={() => navigate(`/watch?v=${video.id}`)} // Click it, it will navigate to watch page
                    className="flex gap-4 cursor-pointer group p-2 hover:bg-[#212121] rounded-xl transition items-start relative"
                    >
                    {/* Thumbnail */}
                    <div className="relative w-40 sm:w-64 aspect-video rounded-xl overflow-hidden bg-gray-800 shrink-0">
                        <img 
                        src={video.snippet?.thumbnails?.medium?.url} 
                        alt={video.snippet?.title} 
                        className="w-full h-full object-cover"
                        />
                    </div>

                    {/* In4 of video */}
                    <div className="flex-1 flex flex-col pr-8">
                        <h3 className="font-semibold text-sm sm:text-base line-clamp-2 text-white">
                            {video.snippet?.title}
                        </h3>
                        <span className="text-xs text-gray-400 mt-1">
                            {video.snippet?.channelTitle}
                        </span>
                                                <span className="text-xs text-gray-400 mt-1">
                            {video.statistics?.viewCount ? `${getView(video.statistics.viewCount)} views` : ''} • {getTimeago(video.snippet.publishedAt)}
                        </span>
                    </div>

                    {/* unlike button*/}
                        </div>
                ))}
            </div>
                )}
            </div>
        </div>
    </>
    );
}