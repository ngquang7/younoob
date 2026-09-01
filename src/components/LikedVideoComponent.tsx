import {useState,useEffect } from 'react';
import { useNavigate, useSearchParams} from 'react-router-dom';

export default function LikedVideoComponent () {
    const [videoList, setVideoList] = useState<any[]>([]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [activeMenuId, setActiveMenuId] = useState(null);
    // Load like_video when go to this page
    const listType = searchParams.get('list') === 'WL' ? 'WL' : 'LL';
    const storageKey = listType === 'WL' ? 'saved_video' : 'like_video';
    const reverseStorageKey = listType === 'WL' ? 'like_video' : 'saved_video';
    const playlistTitle = listType === 'WL';
    const [isShareModal, setIsShareModal] = useState(false);
    const [isNotice, setIsNotice] = useState(false);


    useEffect(() => {
        const savedLikedVideo = JSON.parse(localStorage.getItem(storageKey) || '[]');
        setVideoList(savedLikedVideo);
    }, [listType]);


    const shareToFacebook = (video: any) => {
        if (!video || !video.id) return;
        const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(youtubeUrl)}`;    
        window.open(facebookShareUrl, '_blank');
    };

    const shareToX = (video: any) => {
    if (!video || !video.id) return;
    const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;
    // "replace(/\s*\(playlist\)/gi, '').trim()" delete (playlist) 
    const text = encodeURIComponent(video.snippet?.title ? `${video.snippet?.title.replace(/\s*\(playlist\)/gi, '').trim()}` : '');
    const xShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(youtubeUrl)}&text=${text}`; 
    window.open(xShareUrl, '_blank');
    }

    const shareToLinkedin = (video: any) => {
        if (!video || !video.id) return;
        const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;
        const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(youtubeUrl)}`;    
        window.open(linkedinShareUrl, '_blank');
    }
    const removeVideoFromList = (id: string) => {
        const updated = videoList.filter(v => v.id !== id);
        setVideoList(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
    };

    const addVideoToList = (video: any) => {
    if (!video.id || !video) return;
        const existingListVideos = JSON.parse(localStorage.getItem('saved_video') || '[]');
        const isAlreadyInList = existingListVideos.some((v: any) => v.id === video.id);    
        if(!isAlreadyInList) {
            const updateList = [video, ...existingListVideos];
            localStorage.setItem('saved_video', JSON.stringify(updateList));
        }
    };

    const handleCopyURL = (video: any) => {
    const shareUrl = `https://youtube.com/watch?v=${video.id}`;
        try {
        navigator.clipboard.writeText(shareUrl);
        setIsNotice(true);
        setTimeout ( () => {
        setIsNotice(false);
    }, 2300);
    } catch (error) {
      console.warn("Copy failed ", error);
    }
  };

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
        <div 
            className="flex items-start gap-6 p-6">  
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
                            {video.statistics?.viewCount ? `${getView(video.statistics.viewCount)} views` : ''} • {video.snippet?.publishedAt? `${getTimeago(video.snippet.publishedAt)}` : ''}
                        </span>
                    </div>

                    {/* control button*/}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();    
                            setActiveMenuId(activeMenuId === video.id ? null : video.id);
                        }}
                        className="text-xl w-10 h-10 font-bold font-sans cursor-pointer hover:bg-neutral-700 rounded-full transition-colors"
                    >
                        ⋮
                    </button>
                    {/* Option modal */}
                    {activeMenuId === video.id && (
                        <>
                        <div 
                            className="fixed inset-0 z-40 cursor-default" 
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                            }}
                        />

                        <div 
                            onClick={(e) => e.stopPropagation()}
                            className="overflow-hidden absolute right-0 mt-12 w-64 bg-[#282828] overflow-hidden text-white rounded-xl shadow-2xl py-2 z-50 text-sm border-neutral-700"
                        >
                        <button 
                            className="w-full px-4 py-2 flex items-center -mt-2 cursor-pointer hover:bg-neutral-700 transition-colors text-left rounded-t-xl">
                            <img
                            alt="Add to queue"
                            src="/public/addtoqueue.png" className="h-6 w-6 mr-3"
                            />
                            Add to queue
                        </button>

                        <button 
                            onClick={(e) => {
                                setActiveMenuId(null);
                                addVideoToList(video);
                            }}
                            className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left">
                            <img
                            alt="Save to watch later"
                            src="/public/savetowatchlater.png" className="h-6 w-6 mr-3"
                            />
                            Save to watch later
                        </button>
                        
                        <button 
                            className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left">
                            <img
                            alt="Save to playlist"
                            src="/public/savetoplaylist.png" className="h-6 w-5 mr-3"
                            />
                            Save to playlist
                        </button>

                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsShareModal(true);
                            }}
                            className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left">
                            <img
                            alt="Share"
                            src="/public/share.png" className="h-5 w-5 mr-3"
                            />
                            Share
                        </button>
                        {isShareModal && (
                        <div 
                            onClick={() => setIsShareModal(false)}
                            className="fixed inset-0 z-50 flex items-center justify-center cursor-default bg-black/50 backdrop-blur-l"
                        >
                            {/* Khung chứa nội dung bảng (Màu nền tối giống YouTube, có bo góc và cuộn khi dài) */}
                            <div 
                                onClick={(e) => e.stopPropagation()} 
                                className="bg-[#212121] text-white w-[400px] max-h-[80vh] overflow-y-auto rounded-2xl p-6 shadow-2xl relative [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#555] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                                {/* Nút Đóng (Dấu X góc trên bên phải) */}
                                <button 
                                    onClick={() => setIsShareModal(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl w-10 h-10 rounded-full cursor-pointer"
                                >
                                    ✕
                                </button>
                                    <h2 className="text-xl font-bold mb-6 flex items-center justify-center">
                                        Share
                                    </h2>
                                    {/* onClick={() => window.open(`https://youtube.com/watch?v=${videoId}`, '_blank')} */}
                                    <div className="flex flex-row gap-3">

                                    <button
                                        className="flex flex-col cursor-pointer"
                                        onClick={() => shareToFacebook(video)}
                                    >
                                    <img
                                        alt="Share"
                                        src="/public/facebook.png" 
                                        className="rounded-full object-cover h-15 w-15 mb-2 cursor-pointer"
                                    />
                                    facebook
                                    </button>
                                    <button
                                        className="flex flex-col cursor-pointer"
                                        onClick={() => {shareToX(video)}}
                                    >
                                        <img
                                            src="/public/X.png" 
                                            className="rounded-full object-cover h-17 w-18 cursor-pointer"
                                        />
                                        X
                                    </button>

                                    <button
                                        className="flex flex-col cursor-pointer"
                                        onClick={() => {shareToLinkedin(video)}}
                                    >
                                        <img
                                            src="/public/linkedin.png" 
                                            className="rounded-full object-cover h-17 w-18 cursor-pointer"
                                        />
                                        linked
                                    </button>
                                    </div>
                                    <div className="flex items-center bg-[#1f1f1f] border border-neutral-700 rounded-xl p-2 max-w-md mt-5">
                                    {/* <div className="mt-10 bg-black h-15 rounded-[10px] overflow-x-auto whitespace-nowrap w-full text-white"> */}
                                <input 
                                type="text"  
                                readOnly
                                value={`https://youtube.com/watch?v=${video.id}`} 
                                onClick={(e) => e.currentTarget.select()}
                                className="w-full bg-transparent text-white text-sm px-3 outline-none cursor-text select-all truncate selection:bg-blue-600"
                                />

                                <button 
                                
                                    onClick={() => {
                                        handleCopyURL(video)
                                    }}
                                    className="bg-white hover:bg-neutral-200 text-black font-medium px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap ml-2 cursor-pointer"
                                >
                                    Copy
                                </button>
                                {isNotice && (
                                <div className="fixed bottom-5 left-1/2 px-4 py-2 bg-green-800 text-white text-xs font-semibold rounded-lg shadow-lg transition-all animate-fade-in">
                                    Copy link Successfull !
                                </div>
                                )}
                                    </div>
                                </div>
                            </div>
                            )}

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeVideoFromList(video.id)} 
                            }
                            className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left rounded-b-xl"
                            >
                            <img
                            alt="Add to queue"
                            src="/public/bin.png" className="h-5 w-5 mr-3 pointer-events-none"
                            />
                            Remove from {playlistTitle ? 'Watch later' : 'Liked videos'}
                        </button>
                        </div>
                        </>
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