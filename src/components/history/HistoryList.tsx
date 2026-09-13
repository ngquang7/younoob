import { useNavigate } from 'react-router-dom';
import { formatView } from '../../utils/formatView';
import MenuContainer from '../common/MenuContainer';
import SaveToPlaylistModal from '../common/SaveToPlaylistModal';
import SaveToWatchLater from '../common/SaveToWatchLater';

import ShareModal from '../common/ShareModal';
import AddToQueueButton from '../menu-button/AddToQueueButton';
import PlaylistButton from '../menu-button/PlaylistButton';
import RemoveButton from '../menu-button/RemoveButton';
import ShareButton from '../menu-button/ShareButton';
import SaveToWatchLaterButton from '../menu-button/SaveToWatchLaterButton';

interface HistoryListProps {
    historyListLength: number;
    filteredHistory: any[];
    activeMenuId: string | null;
    setActiveMenuId: (id: string | null) => void;
    selectedVideo: any;
    setSelectedVideo: (video: any) => void;
    watchLaterVideoList: any[];
    isSaved: boolean;
    handleSaveToggle: (video: any) => void;
    handleOpenSaveModal: (video: any) => void;
    showNotice: (msg: string) => void;
    setWatchLaterVideoList: React.Dispatch<React.SetStateAction<any[]>>;
    setIsSaved: React.Dispatch<React.SetStateAction<boolean>>;
    removeFromHistory: (id: string) => void;
    isShareModal: boolean;
    setIsShareModal: (open: boolean) => void;
    selectedShareVideo: any;
    setSelectedShareVideo: (video: any) => void;
}

export default function HistoryList({
    historyListLength,
    filteredHistory,
    activeMenuId,
    setActiveMenuId,
    selectedVideo,
    setSelectedVideo,
    watchLaterVideoList,
    isSaved,
    handleSaveToggle,
    handleOpenSaveModal,
    showNotice,
    setWatchLaterVideoList,
    setIsSaved,
    removeFromHistory,
    isShareModal,
    setIsShareModal,
    selectedShareVideo,
    setSelectedShareVideo,
}: HistoryListProps) {
    const navigate = useNavigate();

    if (historyListLength === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-2">
                <p className="text-lg font-medium">You have no watch history yet.</p>
                <p className="text-sm">Videos you watch will show up here so you can easily find them again.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {filteredHistory.map((video) => (
                <div
                    key={video.id}
                    onClick={() => navigate(`/watch?v=${video.id}`)}
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

                    {/* Info */}
                    <div className="flex-1 flex flex-col pr-8">
                        <h3 className="font-semibold text-sm sm:text-base line-clamp-2 text-white">
                            {video.snippet?.title}
                        </h3>
                        <span className="text-xs text-gray-400 mt-1">
                            {video.snippet?.channelTitle} • {video.statistics?.viewCount ? `${formatView(video.statistics.viewCount)} views` : ''}
                        </span>
                    </div>

                    {/* Menu Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === video.id ? null : video.id);
                        }}
                        className="text-xl w-10 h-10 font-bold font-sans cursor-pointer hover:bg-neutral-700 rounded-full transition-colors flex items-center justify-center"
                    >
                        ⋮
                    </button>

                    {activeMenuId === video.id && (
                        <MenuContainer onClose={() => setActiveMenuId(null)}>
                            <AddToQueueButton />
                            <SaveToWatchLaterButton
                                video={video}
                                onClose={() => setActiveMenuId(null)}
                                showNotice={showNotice}
                                setWatchLaterVideoList={setWatchLaterVideoList}
                                setIsSaved={setIsSaved}
                            />
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
                            <RemoveButton
                                videoId={video.id}
                                label="Remove from history"
                                onClose={() => setActiveMenuId(null)}
                                remove={removeFromHistory}
                            />
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
            ))}
        </div>
    );
}