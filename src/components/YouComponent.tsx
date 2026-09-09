import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { formatView } from '../utils/formatView';
import { formatTimeAgo } from '../utils/formatTimeAgo';
import UserProfile from "../components/UserProfile";
import VideoCard from "../components/VideoCard";
import SectionHeader from './SectionHeader';
import EmptyState from './EmptyState';
import PlaylistCard from './PlaylistCard';

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
    const PlaylistBackgroundLayers = (
        <>
            <div className="absolute -top-4 h-full left-6 right-5 bg-[#3e3e3e] rounded-xl z-0"></div>
            <div className="absolute -top-2 left-3 right-3 h-full bg-[#656563] rounded-xl z-0"></div>
        </>
    );
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
                        <EmptyState message='Your watch history will be show up right here' />
                    )}
                </div>
            </div>

            {/* Playlists */}
            <div className="w-full px-6 mt-1 flex flex-col items-center justify-between border-gray-600">
                <SectionHeader
                    title="Playlists"
                    navigate={navigate}
                    playlistType='playlists'
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5 w-full">
                    <PlaylistCard
                        title="Liked Videos"
                        items={likedList}
                        playlistKey="LL"
                        navigate={navigate}
                        onViewFull={goLikeVideo}
                        PlaylistBackgroundLayers={PlaylistBackgroundLayers}
                    />
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
                        <EmptyState message='Your watch later videos will show up right here' />
                    )}
                </div>
            </div>

            {/* LIKED VIDEOS */}
            <div className="w-full px-6 mt-1 flex flex-col items-center justify-between border-gray-600">
                <SectionHeader
                    title="Liked Video"
                    navigate={navigate}
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
                        <EmptyState message='Your liked video will show up right here' />
                    )}
                </div>
            </div>
        </div>
    );
}