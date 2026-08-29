import {useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PlayListComponent () {
    const [likedVideoList, setlikedVideoList] = useState<any[]>([]);
    const [savedVideoList, setSavedVideoList] = useState<any[]>([]);
    const navigate = useNavigate();

    const goLikeVideo = () => navigate(`/playlist?list=LL`);
    const goWatchLaterVideo = () => navigate(`/playlist?list=WL`);
    useEffect(() => {
        const savedLikedVideo = JSON.parse(localStorage.getItem('like_video') || '[]');
        setlikedVideoList(savedLikedVideo);
    }, []);

    useEffect(() => {
        const savedWatchLaterVideo = JSON.parse(localStorage.getItem('saved_video') || '[]');
        setSavedVideoList(savedWatchLaterVideo);
    }, []);

    return (
        <div className="mx-auto px-3 py-1 text-white min-h-screen">
      
            {/* Header*/}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold font-sans mt-3 ml-3 mb-2">Playlists</h1>

            </div>
            
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ">

                    <div 
                        onClick={() => navigate(`/watch?v=${likedVideoList[0]?.id}&list=LL&start_radio=1`)}
                        className="group rounded-[10px] cursor-pointer hover:bg-[#272727] transition-all"
                    >
                        <div className="relative group">
                            {/* The layer behind (hiệu ứng chồng layer) */}
                            <div className="absolute -top-4  h-full left-6 right-5 bg-[#3e3e3e] rounded-xl z-0"></div>
                            <div className="absolute -top-2 left-3 right-3 h-full bg-[#656563] rounded-xl z-0"></div>
                            {/* The top layer */}
                            {likedVideoList.length > 0 ? (
                    <>
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#212121] z-10">

                    <img 
                        src={likedVideoList[0]?.snippet?.thumbnails?.medium?.url} 
                        alt={likedVideoList[0]?.snippet?.title} 
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
                                    <span>{likedVideoList.length} videos</span>
                                    
                                </div>
                    </div>
                </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 bg-gradient-to-b from-[#5c241c] via-[#241517] to-[#121212]">
                        No thumbnail
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

                    <div 
                        onClick={() => {
                            if(savedVideoList.length > 0) {
                                navigate(`/watch?v=${savedVideoList[0]?.id}&list=WL&start_radio=1`);
                            } else {
                                goWatchLaterVideo();
                            }
                        }}
                        className="group rounded-[10px] cursor-pointer hover:bg-[#272727] transition-all"
                    >
                        <div className="relative group">
                            {/* The layer behind (hiệu ứng chồng layer) */}
                            <div className="absolute -top-4  h-full left-6 right-5 bg-[#3e3e3e] rounded-xl z-0"></div>
                            <div className="absolute -top-2 left-3 right-3 h-full bg-[#656563] rounded-xl z-0"></div>
                            {/* The top layer */}
                            {savedVideoList.length > 0 ? (
                                <>
                                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#212121] z-10">
                                    <img 
                                        src={savedVideoList[0]?.snippet?.thumbnails?.medium?.url} 
                                        alt={savedVideoList[0]?.snippet?.title} 
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
                                                <span>{savedVideoList.length} videos</span>
                                                
                                            </div>
                                </div>
                                </>
                            ) : (
                                <div 
                                    className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#212121] z-10">
                                    <img
                                        src="/public/loading1.png"
                                    />
                                </div>
                            )}
                        </div>
                        {/* Information of playlist */}
                        <div className="flex gap-3 px-1 mt-2">
                            {/* Title video */}
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                                <h3 
                                className="text-m font-sans font-[600] text-[#f1f1f1] leading-snug line-clamp-2 group-hover:text-white transition-colors duration-200"
                                title='Liked Videos'
                                >
                                    Watch Later Videos
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
                                    goWatchLaterVideo();
                                }}
                                className="text-gray-400 text-sm font-[550] hover:text-white z-3">
                                    View full playlist
                                </div>
                            </div>
                        </div> 
                    </div>
                    

                </div>
        </div>
    );
}
