import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { formatView } from '../utils/formatView';
import { formatTimeAgo } from '../utils/formatTimeAgo';
import UserProfile from "../components/UserProfile";
import VideoCard from "../components/VideoCard";
import SectionHeader from './SectionHeader';
export default function YouComponent() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const [historyList, setHistoryList] = useState<any[]>([]);
    const [likedList, setLikedList] = useState<any[]>([]);
    const [savedList, setSavedList] = useState<any[]>([]);
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
        const savedLikedVideo = JSON.parse(localStorage.getItem('like_video') || '[]');
        setLikedList(savedLikedVideo);
    }, []);

    useEffect(() => {
        const savedSavedVideo = JSON.parse(localStorage.getItem('saved_video') || '[]');
        setSavedList(savedSavedVideo);
    }, []);

    return (
        <div className="w-full mt-1 flex flex-col border-gray-600">
            {/* Profile */}
            <UserProfile
                username="Nguyễn Xuân Trí Quang"
                userId="noobgau"
                avatar="/public/Q.png"
            />
            {/* 4 rows (HISTORY, PLAYLISTS, WATCH LATER, LIKED VIDEOS) */}
            {/* History */}
            <div className="w-full px-6 mt-1 flex flex-col items-center justify-between border-gray-600">
                <SectionHeader
                    title="History"
                    navigate={navigate}
                />
                {/* Video History */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ">
                    {historyList.length > 0 ? (
                        <>
                            {historyList.slice(0, 4).map((video) => (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    navigate={navigate}
                                    goChannel={goChannel}
                                    formatView={formatView}
                                    formatTimeAgo={formatTimeAgo}
                                />
                            ))}
                        </>
                    ) : (
                        <>
                            <div className="col-span-full text-sm font-semibold text-gray-400 flex flex-col items-center justify-center text-center w-full">
                                <p>No video yet</p>
                                <p>Your watch history will be show up right here</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Playlists */}
            <div className="w-full px-6 mt-1 flex flex-col items-center justify-between border-gray-600">
                <SectionHeader
                    title="Playlist"
                    navigate={navigate}
                    playlistType='playlists'
                />
                {/* Video in column */}
                {/* lg:grid-cols-4 in small screen is not problem, but when it comes to big screen, it will have some error format */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5 ">
                    <div
                        onClick={() => {
                            if (likedList.length > 0) {
                                navigate(`/watch?v=${likedList[0]?.id}&list=LL`);
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
                                            alt={likedList[0]?.snippet?.title}
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
                                                <path d="M22 7H2v1h20V7zm-9 5H2v-1h11v1zm0 4H2v-1h11v1zm7-5v7l6-3.5-6-3.5z" />
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
                                            <path d="M22 7H2v1h20V7zm-9 5H2v-1h11v1zm0 4H2v-1h11v1zm7-5v7l6-3.5-6-3.5z" />
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
                <SectionHeader
                    title="Watch Later"
                    navigate={navigate}
                    playlistType='WL'
                />
                <div className="text-sm font-semibold w-full text-left -mt-6 mb-5 text-gray-500">{savedList.length} video</div>
                {/* Watch Later Video */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {savedList.length > 0 ? (
                        <>
                            {savedList.slice(0, 4).map((video) => (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    navigate={navigate}
                                    goChannel={goChannel}
                                    formatView={formatView}
                                    formatTimeAgo={formatTimeAgo}
                                />
                            ))}
                        </>
                    ) : (
                        <>
                            <div className="col-span-full text-sm font-semibold text-gray-400 flex flex-col items-center justify-center text-center w-full">
                                <p>No video yet</p>
                                <p>Your watch later videos will show up right here</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* LIKED VIDEOS */}
            <div className="w-full px-6 mt-1 flex flex-col items-center justify-between border-gray-600">
                <SectionHeader
                    title="Liked Video"
                    navigate={navigate}
                    playlistType='LL'
                />
                <div className="text-sm font-semibold w-full text-left -mt-6 mb-5 text-gray-500">{likedList.length} video</div>
                {/* Liked Video */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ">
                    {likedList.length > 0 ? (
                        <>
                            {likedList.slice(0, 4).map((video) => (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    navigate={navigate}
                                    goChannel={goChannel}
                                    formatView={formatView}
                                    formatTimeAgo={formatTimeAgo}
                                />
                            ))}
                        </>
                    ) : (
                        <>
                            <div className="col-span-full text-sm font-semibold text-gray-400 flex flex-col items-center justify-center text-center w-full">
                                <p>No video yet</p>
                                <p>Your liked video will show up right here</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}