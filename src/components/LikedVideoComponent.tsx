import {useState,useEffect } from 'react';
import { useNavigate, useSearchParams} from 'react-router-dom';

export default function LikedVideoComponent () {
    const [videoList, seVideoList] = useState<any[]>([]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isControlOpen, setIsControlOpen] = useState(false);
    // Load like_video when go to this page
    const listType = searchParams.get('list') === 'WL' ? 'WL' : 'LL';
    const storageKey = listType === 'WL' ? 'saved_video' : 'like_video';
    const playlistTitle = listType === 'WL';
    useEffect(() => {
        const savedLikedVideo = JSON.parse(localStorage.getItem(storageKey) || '[]');
        seVideoList(savedLikedVideo);
    }, [listType]);

    const getTotalLikedVideo = videoList.length;
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
            <aside className="fixed w-100 h-180 shrink-0 bg-zinc-900 border-r border-zinc-800 rounded-[15px] overflow-hidden">
                    {videoList.length > 0 ? (
                <>
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <img
                        src={videoList[0]?.snippet?.thumbnails?.medium?.url}
                        className="absolute inset-0 w-full h-full object-cover filter blur-lg opacity-60 pointer-events-none"
                    />
                    </div>
                    {/* Darker background */}
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div
                        onClick={() => navigate(`/watch?v=${videoList[0]?.id}&list=${listType}`)}
                        className="relative group inline-block ml-5 mt-5 cursor-pointer">
                    <img 
                        src={videoList[0]?.snippet?.thumbnails?.medium?.url} 
                        alt={videoList[0]?.snippet?.title} 
                        className="w-90 h-50 object-cover rounded-[10px] flex relative cursor-pointer group-hover:brightness-40 transition duration-300"
                    />
                        <div className="rounded-[10px] absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            {/* Icon Play */}
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M6 4l15 8-15 8z" />
                            </svg>
                            <span className="font-semibold">Play all</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold font-sans mt-5 ml-5 z-10 flex relative">Liked Videos</h1>                
                    <p className="text-l font-bold font-sans mt-5 ml-5 z-10 flex relative">Quang playList</p>
                    <p className="text-m text-gray-400 mt-1 ml-5 z-10 flex relative">{getTotalLikedVideo} videos</p>
                    <button 
                        className=" cursor-pointer bg-white h-[40px] w-[150px] mt-5 ml-5 z-10 flex relative rounded-[20px] flex items-center justify-center hover:bg-gray-300"
                        onClick={() => navigate(`/watch?v=${videoList[0]?.id}&list=${listType}`)}
                    >
                        <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 20 20">
                                <path d="M6 4l15 8-15 8z" />
                            </svg>
                    <div className="text-2sm font-bold font-sans ml-2 z-10 flex relative text-black">Play all</div>
                    </button>
                </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 bg-gradient-to-b from-[#5c241c] via-[#241517] to-[#121212]">
                        No thumbnail
                    </div>
                )}
            </aside>

            {/* Right */}
            <div className="flex-1 ml-105 flex flex-col h-full gap-4">
                {videoList.length === 0 ? (
                    <>
                    <h1 className="text-2xl font-bold font-sans mt-3 ml-3">{playlistTitle ? 'Watch Later' : 'Liked Videos'}</h1>
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-2">
                    <p className="text-lg font-medium">You have no video in this playlist yet.</p>
                    <p className="text-sm">Videos you save in this playlist will show up here so you can easily find them again.</p>
                    </div>
                    </>
                ) : (
                /* Video in column */
                <div className="flex flex-col gap-3">
                {videoList.map((video, index) => (
                    <div 
                    key={video.id} 
                    onClick={() => navigate(`/watch?v=${video.id}&list=${listType}&index=${index+1}`)} // Click it, it will navigate to watch page
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

                    {/* control button*/}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsControlOpen(!isControlOpen);
                        }}
                        className="text-2xl p-2 font-bold font-sans cursor-pointer hover:bg-neutral-700/60 rounded-full transition-colors"
                    >
                        ⋮
                    </button>
                    {/* Option modal */}
                    {isControlOpen && (
                        <div className="absolute right-0 mt-12 w-64 bg-[#282828] text-white rounded-xl shadow-2xl py-2 z-50 text-sm border border-neutral-700">
                        
                        </div>
                    )}
                    </div>
                ))}
            </div>
                )}
            </div>
        </div>  
    </>
    );
}