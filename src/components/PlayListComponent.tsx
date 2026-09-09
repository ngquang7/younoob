import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlaylistCard from './PlaylistCard';
export default function PlayListComponent() {
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

    const PlaylistBackgroundLayers = (
        <>
            <div className="absolute -top-4  h-full left-6 right-5 bg-[#3e3e3e] rounded-xl z-0"></div>
            <div className="absolute -top-2 left-3 right-3 h-full bg-[#656563] rounded-xl z-0"></div>
        </>
    )
    return (
        <div className="mx-auto px-3 py-1 text-white min-h-screen">

            {/* Header*/}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold font-sans mt-3 ml-3 mb-2">Playlists</h1>

            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ">

                <PlaylistCard
                    title="Liked Videos"
                    items={likedVideoList}
                    playlistKey="LL"
                    navigate={navigate}
                    onViewFull={goLikeVideo}
                    PlaylistBackgroundLayers={PlaylistBackgroundLayers}
                />

                <PlaylistCard
                    title="Watch Later Videos"
                    items={savedVideoList}
                    playlistKey="WL"
                    navigate={navigate}
                    onViewFull={goWatchLaterVideo}
                    PlaylistBackgroundLayers={PlaylistBackgroundLayers}
                />
            </div>
        </div>
    );
}
