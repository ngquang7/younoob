interface SectionHeaderProps {
    title: string;
    navigate: (path: string) => void;
    playlistType?: string;
}

export default function SectionHeader({
    title,
    navigate,
    playlistType
}: SectionHeaderProps) {
    const handleViewAll = () => {
        if (playlistType == 'WL' || playlistType == 'LL') {
            navigate(`/playlist?list=${playlistType}`);
        } else if (playlistType == 'playlists') {
            navigate(`/feed/playlists`);
        } else {
            navigate(`/feed/history`);
        }
    }
    return (
        <div className="text-xl font-bold text-white flex flex-row items-center justify-between w-full mt-8 mb-5">
            <span>{title}</span>
            <button
                className="text-sm font-semibold text-white cursor-pointer h-[40px] w-[90px] rounded-[20px] border border-gray-300 hover:bg-gray-500"
                onClick={handleViewAll}
            >
                View all
            </button>
        </div>
    );
}