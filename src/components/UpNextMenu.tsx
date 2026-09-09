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

export default function UpNextMenu({
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
    return (<>
        <div
            className="fixed inset-0 z-40 cursor-default"
            onClick={(e) => {
                e.stopPropagation();
                setActiveMenuId(null);
            }}
        />

        <div
            onClick={(e) => e.stopPropagation()}
            className="overflow-hidden absolute right-0 mt-[110px] w-[200px] bg-[#282828] text-white rounded-xl shadow-2xl py-2 z-50 text-sm border-neutral-700"
        >
            <button className="w-full px-4 py-2 flex items-center -mt-2 cursor-pointer hover:bg-neutral-700 transition-colors text-left rounded-t-xl">
                <img
                    alt="Add to queue"
                    src="/public/addtoqueue.png"
                    className="h-6 w-6 mr-3"
                />
                Add to queue
            </button>
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
        </div>
    </>);
}
