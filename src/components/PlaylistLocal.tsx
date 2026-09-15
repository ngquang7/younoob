import { useNavigate } from 'react-router-dom';
import { formatView } from '../utils/formatView';
import { formatTimeAgo } from '../utils/formatTimeAgo';
import MenuContainer from './common/MenuContainer';
import SaveToPlaylistModal from './common/SaveToPlaylistModal';
import SaveToWatchLater from './common/SaveToWatchLater';

import ShareModal from './common/ShareModal';
import AddToQueueButton from './menu-button/AddToQueueButton';
import PlaylistButton from './menu-button/PlaylistButton';
import RemoveButton from './menu-button/RemoveButton';
import ShareButton from './menu-button/ShareButton';
import SaveToWatchLaterButton from './menu-button/SaveToWatchLaterButton';
interface PlaylistLocalProps {
    videoListLength: number;
    playlistTitle: boolean;
    videoList: any[];
    listType: string;
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
    removeVideoFromList: (id: string) => void;
    isShareModal: boolean;
    setIsShareModal: (open: boolean) => void;
    selectedShareVideo: any;
    setSelectedShareVideo: (video: any) => void;

}
export default function PlaylistLocal({
    videoListLength,
    playlistTitle,
    videoList,
    listType,
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
    removeVideoFromList,
    isShareModal,
    setIsShareModal,
    selectedShareVideo,
    setSelectedShareVideo,
}: PlaylistLocalProps) {
    const navigate = useNavigate();

    if (videoListLength === 0) {
        return (
            <>
                <div className="flex-1 ml-105 flex flex-col h-full gap-4">
                    <h1 className="text-2xl font-bold font-sans mt-3 ml-3">{playlistTitle ? 'Watch Later' : 'Liked Videos'}</h1>
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-2">
                        <p className="text-lg font-medium">You have no video in this playlist yet.</p>
                        <p className="text-sm">Videos you save in this playlist will show up here so you can easily find them again.</p>
                    </div>
                </div>
            </>
        )
    }
    return (
        <div className="flex-1 ml-105 flex flex-col h-full gap-4">
            <div className="flex flex-col gap-3">
                {videoList.map((video, index) => (
                    <div
                        key={video.id}
                        onClick={() => navigate(`/watch?v=${video.id}&list=${listType}&index=${index + 1}`)} // Click it, it will navigate to watch page
                        className="flex gap-4 cursor-pointer group p-2 hover:bg-gray-600 rounded-xl transition items-start relative"
                    >
                        {/* Thumbnail */}
                        <div className="relative sm:w-64 aspect-video rounded-lg overflow-hidden bg-gray-800 shrink-0">
                            <img
                                src={video.snippet?.thumbnails?.medium?.url}
                                alt={video.snippet?.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* IN4 OF VIDEOS */}
                        <div className="flex-1 flex flex-col pr-8">
                            <h3 className="font-semibold text-sm sm:text-base line-clamp-2 text-white">
                                {video.snippet?.title}
                            </h3>
                            <span className="text-xs text-gray-400 mt-1">
                                {video.snippet?.channelTitle}
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                                {video.statistics?.viewCount ? `${formatView(video.statistics.viewCount)} views` : ''} • {video.snippet?.publishedAt ? `${formatTimeAgo(video.snippet.publishedAt)}` : ''}
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
                        {/* OPTION MODAL */}
                        {activeMenuId === video.id && (
                            <MenuContainer onClose={() => setActiveMenuId(null)}>
                                <AddToQueueButton />
                                {!playlistTitle && (
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
                                <RemoveButton
                                    videoId={video.id}
                                    label={`Remove from ${playlistTitle ? 'Watch Later' : 'Liked Videos'}`}
                                    onClose={() => setActiveMenuId(null)}
                                    remove={removeVideoFromList}
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
        </div>
    );
}