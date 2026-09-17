import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { storageService } from '../hooks/storageService';
import PlaylistLocal from './PlaylistLocal';
import { getPlaylistDetails, getPlaylistItems } from '../api/playlistData'; 

export default function PlaylistTest() {
    const [videoList, setVideoList] = useState<any[]>([]);
    const [watchLaterVideoList, setWatchLaterVideoList] = useState<any[]>([]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [selectedShareVideo, setSelectedShareVideo] = useState<any>(null);

    const [isShareModal, setIsShareModal] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

    const [publicPlaylistMeta, setPublicPlaylistMeta] = useState<any>(null);
    const [isLoadingAPI, setIsLoadingAPI] = useState(false);

    const listParam = searchParams.get('list');
    
    const isPublicPlaylist = listParam && !['LL', 'WL'].includes(listParam);

    const listType = listParam === 'WL' ? 'WL' : 'LL';
    const storageKey = listType === 'WL' ? 'saved_video' : 'like_video';
    
    const title = isPublicPlaylist 
        ? (publicPlaylistMeta?.snippet?.title || 'YouTube Playlist') 
        : (listParam === 'WL' ? 'Watch Later' : 'Liked Video');

    const channelTitle = isPublicPlaylist 
        ? (publicPlaylistMeta?.snippet?.channelTitle || '') 
        : 'Quang playList';

    const getTotalVideo = isPublicPlaylist 
        ? (publicPlaylistMeta?.contentDetails?.itemCount || videoList.length) 
        : videoList.length;

    const thumbnailSrc = isPublicPlaylist
        ? (publicPlaylistMeta?.snippet?.thumbnails?.medium?.url || videoList[0]?.snippet?.thumbnails?.medium?.url)
        : videoList[0]?.snippet?.thumbnails?.medium?.url;

    useEffect(() => {
        setWatchLaterVideoList(storageService.getSaved());
    }, []);

    useEffect(() => {
        const fetchPlaylistData = async () => {
            if (isPublicPlaylist && listParam) {
                try {
                    setIsLoadingAPI(true);
                    const [metaRes, itemsRes] = await Promise.all([
                        getPlaylistDetails(listParam),
                        getPlaylistItems(listParam)
                    ]);

                    if (metaRes.items && metaRes.items.length > 0) {
                        setPublicPlaylistMeta(metaRes.items[0]);
                    }

                    if (itemsRes.items) {
                        setVideoList(itemsRes.items);
                    }
                } catch (error) {
                    console.error("Lỗi khi tải public playlist:", error);
                    showNotice("Không thể tải danh sách playlist này.");
                } finally {
                    setIsLoadingAPI(false);
                }
            } else {
                const data = listParam === 'WL' ? storageService.getSaved() : storageService.getLiked();
                setVideoList(data);
                setPublicPlaylistMeta(null);
            }
        };

        fetchPlaylistData();
    }, [listParam]);

    const showNotice = (message: string) => {
        setNoticeMessage(message);
        setTimeout(() => {
            setNoticeMessage(null);
        }, 2300);
    };

    const handleOpenSaveModal = (video: any) => {
        if (video && video.id) {
            const savedVideos = storageService.getSaved();
            const videoId = video.id || video?.id?.videoId || video?.snippet?.resourceId?.videoId;
            const savedStatus = savedVideos.some((v: any) => (v.id || v?.id?.videoId || v?.snippet?.resourceId?.videoId) === videoId);
            setIsSaved(savedStatus);
        }
    };

    const removeVideoFromList = (id: string) => {
        if (isPublicPlaylist) {
            showNotice("Không thể xóa video khỏi playlist công khai của người khác.");
            return;
        }
        const updated = videoList.filter(v => v.id !== id);
        setVideoList(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        showNotice(`Removed from ${title}`);
    };

    const handleSaveToggle = (video: any) => {
        if (!video) return;
        const isNowSaved = storageService.toggleSave(video);
        setIsSaved(isNowSaved);
        setWatchLaterVideoList(storageService.getSaved());
        showNotice(isNowSaved ? `Saved to Watch Later` : `Removed from Watch Later`);
    };

    return (
        <>
            <div className="flex items-start gap-6 p-6">
                {/* LEFT */}
                <aside className="fixed w-100 h-180 shrink-0 bg-zinc-900 border-r border-zinc-800 rounded-[15px] overflow-hidden">
                    {isLoadingAPI ? (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Loading playlist...
                        </div>
                    ) : videoList.length > 0 ? (
                        <>
                            <div className="absolute inset-0 overflow-hidden rounded-xl">
                                <img
                                    src={thumbnailSrc}
                                    className="absolute inset-0 w-full h-full object-cover filter blur-lg opacity-60 pointer-events-none"
                                />
                            </div>
                            {/* Darker background */}
                            <div className="absolute inset-0 bg-black/30"></div>
                            <div
                                onClick={() => navigate(`/watch?v=${videoList[0]?.snippet?.resourceId?.videoId || videoList[0]?.id}&list=${listParam || listType}`)}
                                className="relative group inline-block ml-5 mt-5 cursor-pointer">
                                <img
                                    src={thumbnailSrc}
                                    alt={title}
                                    className="w-90 h-50 object-cover rounded-[10px] flex relative cursor-pointer group-hover:brightness-40 transition duration-300"
                                />
                                <div className="rounded-[10px] absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                    {/* Icon Play */}
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M6 4l15 8-15 8z" />
                                    </svg>
                                    <span className="font-semibold ml-2">Play all</span>
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold font-sans mt-5 ml-5 z-10 flex relative line-clamp-1">{title}</h1>
                            <p className="text-l font-bold font-sans mt-2 ml-5 z-10 flex relative">{channelTitle}</p>
                            <p className="text-m text-gray-400 mt-1 ml-5 z-10 flex relative">{getTotalVideo} videos</p>
                            <button
                                className="cursor-pointer bg-white h-[40px] w-[150px] mt-5 ml-5 z-10 flex relative rounded-[20px] items-center justify-center hover:bg-gray-300 transition"
                                onClick={() => navigate(`/watch?v=${videoList[0]?.snippet?.resourceId?.videoId || videoList[0]?.id}&list=${listParam || listType}`)}
                            >
                                <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 20 20">
                                    <path d="M6 4l15 8-15 8z" />
                                </svg>
                                <div className="text-sm font-bold font-sans ml-2 text-black">Play all</div>
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 bg-gradient-to-b from-[#5c241c] via-[#241517] to-[#121212]">
                            No thumbnail
                        </div>
                    )}
                </aside>

                {/* RIGHT */}
                <PlaylistLocal
                    videoListLength={videoList.length}
                    playlistTitle={!isPublicPlaylist && listType === 'WL'}
                    videoList={videoList}
                    listType={listParam || listType}
                    activeMenuId={activeMenuId}
                    setActiveMenuId={setActiveMenuId}
                    selectedVideo={selectedVideo}
                    setSelectedVideo={setSelectedVideo}
                    watchLaterVideoList={watchLaterVideoList}
                    isSaved={isSaved}
                    handleSaveToggle={handleSaveToggle}
                    handleOpenSaveModal={handleOpenSaveModal}
                    showNotice={showNotice}
                    setWatchLaterVideoList={setWatchLaterVideoList}
                    setIsSaved={setIsSaved}
                    removeVideoFromList={removeVideoFromList}
                    isShareModal={isShareModal}
                    setIsShareModal={setIsShareModal}
                    selectedShareVideo={selectedShareVideo}
                    setSelectedShareVideo={setSelectedShareVideo}
                />
                {noticeMessage && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-white border border-neutral-700 text-black text-sm font-semibold rounded-xl shadow-2xl transition-all animate-fade-in flex items-center gap-2">
                        <span>{noticeMessage}</span>
                    </div>
                )}
            </div>
        </>
    );
}