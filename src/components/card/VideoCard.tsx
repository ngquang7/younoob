import { useState } from "react";
import { formatTimeAgo } from "../../utils/formatTimeAgo";
import { formatView } from "../../utils/formatView";
import { storageService } from "../../hooks/storageService";
import MenuContainer from '../common/MenuContainer';
import SaveToPlaylistModal from '../common/SaveToPlaylistModal';
import SaveToWatchLater from '../common/SaveToWatchLater';

import ShareModal from '../common/ShareModal';
import AddToQueueButton from '../menu-button/AddToQueueButton';
import PlaylistButton from '../menu-button/PlaylistButton';
import RemoveButton from '../menu-button/RemoveButton';
import ShareButton from '../menu-button/ShareButton';
import SaveToWatchLaterButton from '../menu-button/SaveToWatchLaterButton';
interface VideoCardProps {
    video: any;
    navigate: (path: string) => void;
    showNotice: (msg: string) => void;
    type: 'history' | 'liked' | 'watchlater';
}

export default function VideoCard({
    video,
    navigate,
    showNotice,
    type,
}: VideoCardProps) {
    const [historyList, setHistoryList] = useState<any[]>([]);

    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
    const [isShareModal, setIsShareModal] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [watchLaterVideoList, setWatchLaterVideoList] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedShareVideo, setSelectedShareVideo] = useState<any>(null);
    const goChannel = (channelId: string) => navigate(`/channel/${channelId}`);

    const handleOpenSaveModal = (video: any) => {
        if (video && video.id) {
            const savedVideos = storageService.getSaved();
            const isSaved = savedVideos.some((v: any) => v.id === video.id);
            setIsSaved(isSaved);
            setSelectedVideo(video);
            setWatchLaterVideoList(savedVideos);
        }
    };

    const handleRemove = () => {
        if (type === 'history') {
            storageService.removeHistoryItem(video.id);
            showNotice("Removed from watch history");
        } else if (type === 'liked') {
            storageService.removeFromLiked(video.id);
            showNotice("Removed from liked videos");
        } else if (type === 'watchlater') {
            storageService.removeFromSaved(video.id);
            showNotice("Removed from watch later");
        }
        window.dispatchEvent(new Event('storage_updated'));
        setActiveMenuId(null);
    };

    const handleSaveToggle = (video: any) => {
        if (!video || !video.id) return;
        const isNowSaved = storageService.toggleSave(video);
        setWatchLaterVideoList(storageService.getSaved());
        setIsSaved(isNowSaved);
        if (isNowSaved) {
            showNotice(`Saved to Watch Later`);
        } else {
            showNotice(`Removed from Watch Later`);
        }
    };

    return (
        <div
            onClick={() => navigate(`/watch?v=${video.id}`)}
            className="group rounded-[10px] cursor-pointer hover:bg-[#272727] transition-all"
        >
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#212121] mb-3">
                <img
                    src={video.snippet.thumbnails.medium?.url}
                    alt={video.snippet.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Details (Avatar, Title, Channel, Stats) PART */}
            <div className="flex gap-3 px-1">
                {/* Channel Avatar */}
                <div className="shrink-0">
                    <img
                        src={video.snippet.thumbnails.default?.url}
                        alt={video.snippet.channelTitle}
                        className="w-9 h-9 rounded-full object-cover border border-[#303030] hover:ring-2 hover:ring-white/10 transition-all"
                        referrerPolicy="no-referrer"
                    />
                </div>

                {/* Title video */}
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex flex-row">
                        <h3 className="text-sm font-sans font-semibold text-[#f1f1f1] leading-snug line-clamp-2 group-hover:text-white transition-colors duration-200">
                            {video.snippet.title}
                        </h3>
                        <div className="relative inline-block">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenuId(activeMenuId === video.id ? null : video.id);
                                }}
                                className="w-8 h-8 flex-shrink-0 font-bold font-sans cursor-pointer hover:bg-neutral-700 rounded-full transition-colors flex items-center justify-center text-white"
                            >
                                ⋮
                            </button>
                            {activeMenuId === video.id && (
                                <MenuContainer
                                    className="mt-2"
                                    onClose={() => setActiveMenuId(null)}>
                                    <AddToQueueButton />
                                    {(type === 'history' || type === 'liked') && (
                                        <SaveToWatchLaterButton
                                            video={video}
                                            onClose={() => setActiveMenuId(null)}
                                            showNotice={showNotice}
                                            setWatchLaterVideoList={setWatchLaterVideoList}
                                            setIsSaved={setIsSaved}
                                        />
                                    )}
                                    <PlaylistButton
                                        video={video}
                                        onClose={() => setActiveMenuId(null)}
                                        setSelectedVideo={setSelectedVideo}
                                        handleOpenSaveModal={handleOpenSaveModal}
                                    />
                                    <ShareButton
                                        onOpenShareModal={() => {
                                            setSelectedShareVideo(video);
                                            setIsShareModal(true);
                                        }}
                                    />
                                    <ShareModal
                                        isOpen={isShareModal && selectedShareVideo?.id === video.id}
                                        onClose={() => setIsShareModal(false)}
                                        videoId={selectedShareVideo?.id || ''}
                                        videoTitle={selectedShareVideo?.snippet?.title || ''}
                                        showNotice={showNotice}
                                    />
                                    {(type === 'history' || type === 'watchlater') && (
                                        <RemoveButton
                                            videoId={video.id}
                                            label={
                                                type === 'history' ? "Remove from watch history" : "Remove from watch later"
                                            } onClose={() => setActiveMenuId(null)}
                                            remove={handleRemove}
                                        />
                                    )}
                                </MenuContainer>
                            )}

                            {selectedVideo?.id === video.id && (
                                <SaveToPlaylistModal onClose={() => setSelectedVideo(null)}>
                                    <SaveToWatchLater
                                        watchLaterVideoList={watchLaterVideoList}
                                        isSaved={isSaved}
                                        onToggleSave={() => handleSaveToggle(selectedVideo)}
                                    />
                                </SaveToPlaylistModal>
                            )}
                        </div>
                    </div>

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
                            <span className="text-gray-400">{formatView(video?.statistics?.viewCount || "")} views</span>
                            <span className="mx-1.5 text-[8px]">•</span>
                            <span className="text-gray-400">{formatTimeAgo(video.snippet.publishedAt)}</span>


                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}