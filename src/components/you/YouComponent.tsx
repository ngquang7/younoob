import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { formatView } from '../../utils/formatView';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import UserProfile from "./UserProfile";
import VideoCard from "../card/VideoCard";
import SectionHeader from './SectionHeader';
import EmptyState from '../common/EmptyState';
import PlaylistCard from '../card/PlaylistCard';

export default function YouComponent() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const [historyList, setHistoryList] = useState<any[]>([]);
    const [likedList, setLikedList] = useState<any[]>([]);
    const [savedList, setSavedList] = useState<any[]>([]);
    const [isHovered, setIsHovered] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
    const goLikeVideo = () => navigate(`/playlist?list=LL`);

    const showNotice = (message: string) => {
        setNoticeMessage(message);
        setTimeout(() => {
            setNoticeMessage(null);
        }, 2300);
    };

    const loadUserData = () => {
        const savedHistory = JSON.parse(localStorage.getItem('watch_history') || '[]');
        const savedLikedVideo = JSON.parse(localStorage.getItem('like_video') || '[]');
        const savedSavedVideo = JSON.parse(localStorage.getItem('saved_video') || '[]');

        setHistoryList(savedHistory);
        setLikedList(savedLikedVideo);
        setSavedList(savedSavedVideo);
    };

    useEffect(() => {
        loadUserData();
        window.addEventListener('focus', loadUserData);
        window.addEventListener('storage_updated', loadUserData);

        return () => {
            window.removeEventListener('focus', loadUserData);
            window.removeEventListener('storage_updated', loadUserData);
        };
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
                <div className={`grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4`}>
                    {historyList.length > 0 ? (
                        <>

                            {historyList.slice(0, 4).map((video, index) => (
                                <div
                                    key={video.id}
                                    className={`
                                    ${index === 2 ? 'hidden md:block' : ''}
                                    ${index === 3 ? 'hidden lg:block' : ''}
                                `}
                                >
                                    <VideoCard
                                        key={video.id}
                                        video={video}
                                        navigate={navigate}
                                        showNotice={showNotice}
                                        type="history"
                                    />
                                </div>
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
                <div className={`grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4`}>
                    {savedList.length > 0 ? (
                        <>
                            {savedList.slice(0, 4).map((video, index) => (
                                <div
                                    key={video.id}
                                    className={`
                                    ${index === 2 ? 'hidden md:block' : ''}
                                    ${index === 3 ? 'hidden lg:block' : ''}
                                `}
                                >
                                    <VideoCard
                                        key={video.id}
                                        video={video}
                                        navigate={navigate}
                                        showNotice={showNotice}
                                        type="watchlater"
                                    />
                                </div>
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
                    playlistType='LL'
                />
                <div className="text-sm font-semibold w-full text-left -mt-6 mb-5 text-gray-500">{likedList.length} video</div>
                {/* Liked Video */}
                <div className={`grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4`}>
                    {likedList.length > 0 ? (
                        <>
                            {likedList.slice(0, 4).map((video, index) => (
                                <div
                                    key={video.id}
                                    className={`
                                    ${index === 2 ? 'hidden md:block' : ''}
                                    ${index === 3 ? 'hidden lg:block' : ''}
                                    `}
                                >
                                    <VideoCard
                                        key={video.id}
                                        video={video}
                                        navigate={navigate}
                                        showNotice={showNotice}
                                        type="liked"
                                    />
                                </div>
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