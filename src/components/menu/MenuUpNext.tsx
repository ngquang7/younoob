import MenuContainer from "../common/MenuContainer";
import SaveToPlaylistModal from '../common/SaveToPlaylistModal';
import SaveToWatchLater from '../common/SaveToWatchLater';
import ShareModal from '../common/ShareModal';
import AddToQueueButton from '../menu-button/AddToQueueButton';
import PlaylistButton from '../menu-button/PlaylistButton';
import RemoveButton from '../menu-button/RemoveButton';
import ShareButton from '../menu-button/ShareButton';
import SaveToWatchLaterButton from '../menu-button/SaveToWatchLaterButton';
interface UpNextMenuProps {
    video: any;
    vId: string;
    activeMenuId: string | null;
    setActiveMenuId: (id: string | null) => void;
    addVideoToList: (video: any) => void;
    setSelectedVideo: (video: any) => void;
    setShareVideoTarget: (target: { id: string; title: string }) => void;
    setIsShareModalUpNext: (isOpen: boolean) => void;
}

export default function MenuUpNext({
    video,
    vId,
    activeMenuId,
    setActiveMenuId,
    addVideoToList,
    setSelectedVideo,
    setShareVideoTarget,
    setIsShareModalUpNext,
}: UpNextMenuProps) {
    if (activeMenuId !== vId) return null;
    return (
        <>
            <MenuContainer
                className="mt-28 right-0"
                onClose={() => setActiveMenuId(null)}>
                <AddToQueueButton />
                <button
                    onClick={() => {
                        setActiveMenuId(null);
                        addVideoToList(video);
                    }}
                    className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left"
                >
                    <img
                        alt="Save to watch later"
                        src="/public/savetowatchlater.png"
                        className="h-6 w-6 mr-3"
                    />
                    Save to watch later
                </button>


                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(null);
                        setSelectedVideo(video);
                    }}
                    className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left"
                >
                    <img
                        alt="Save to playlist"
                        src="/public/savetoplaylist.png"
                        className="h-6 w-5 mr-3"
                    />
                    Save to playlist
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShareVideoTarget({
                            id: vId,
                            title: video.snippet?.title || '',
                        });
                        setIsShareModalUpNext(true);
                    }}
                    className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left"
                >
                    <img
                        alt="Share"
                        src="/public/share.png"
                        className="h-5 w-5 mr-3"
                    />
                    Share
                </button>
            </MenuContainer>
        </>
    );
}
