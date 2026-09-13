import MenuContainer from "../common/MenuContainer";
interface PlaylistMenuProps {
    item: any;
    listType: boolean;
    activeMenuId: string | null;
    setActiveMenuId: (id: string | null) => void;
    addVideoToList: (video: any) => void;
    removeVideoFromList: (id: string) => void;
    setShareVideoTarget: (target: { id: string; title: string }) => void;
    setIsShareModalUpNext: (isOpen: boolean) => void;
}

export default function MenuPlaylist({
    item,
    listType,
    activeMenuId,
    setActiveMenuId,
    addVideoToList,
    removeVideoFromList,
    setShareVideoTarget,
    setIsShareModalUpNext,
}: PlaylistMenuProps) {
    if (activeMenuId !== item.id) return null;

    return (
        <>
            <MenuContainer
                className="mt-[55px]"
                onClose={() => setActiveMenuId(null)}>
                <div className="pb-2 border-b border-gray-500">
                    {!listType && (
                        <button
                            onClick={() => {
                                setActiveMenuId(null);
                                addVideoToList(item);
                            }}
                            className="w-full px-4 py-2 flex items-center -mt-2 cursor-pointer hover:bg-neutral-700 transition-colors text-left rounded-t-xl"
                        >
                            <img
                                alt="Save to Watch Later"
                                src="/public/savetowatchlater.png"
                                className="h-6 w-6 mr-3"
                            />
                            Save to Watch later
                        </button>
                    )}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShareVideoTarget({
                                id: item.id,
                                title: item.snippet?.title || '',
                            });
                            setIsShareModalUpNext(true);
                            setActiveMenuId(null);
                        }}
                        className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left"
                    >
                        <img alt="Share" src="/public/share.png" className="h-5 w-5 mr-3" />
                        Share
                    </button>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        removeVideoFromList(item.id);
                        setActiveMenuId(null);
                    }}
                    className="mt-1 w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left"
                >
                    <img
                        alt="Remove"
                        src="/public/bin.png"
                        className="h-5 w-5 mr-3 pointer-events-none"
                    />
                    Remove from {listType ? 'Watch later' : 'Liked videos'}
                </button>
            </MenuContainer>
        </>
    );
}