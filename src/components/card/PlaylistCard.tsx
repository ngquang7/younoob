import React from 'react';

interface PlaylistCardProps {
    title: string;
    items: any[];
    visibility?: string;
    playlistKey: string; // Truyền 'LL' hoặc 'WL'
    navigate: (path: string) => void;
    onViewFull: () => void;
    PlaylistBackgroundLayers: React.ReactNode;
}

export default function PlaylistCard({
    title,
    items = [],
    visibility = "Private",
    playlistKey,
    navigate,
    onViewFull,
    PlaylistBackgroundLayers,
}: PlaylistCardProps) {
    const firstItem = items?.[0];
    const hasItems = items && items.length > 0;

    return (
        <div
            onClick={() => {
                if (hasItems) {
                    navigate(`/watch?v=${firstItem?.id}&list=${playlistKey}`);
                } else {
                    onViewFull();
                }
            }}
            className="group rounded-[10px] cursor-pointer hover:bg-[#272727] transition-all"
        >
            <div className="relative group">
                {PlaylistBackgroundLayers}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#212121] z-10">
                    {hasItems ? (
                        <img
                            src={firstItem?.snippet?.thumbnails?.medium?.url}
                            alt={title}
                            className="w-full h-full object-cover rounded-[10px] flex relative cursor-pointer"
                        />
                    ) : (
                        <img src="/public/loading1.png" alt="No videos" className="w-full h-full object-cover" />
                    )}

                    {hasItems && (
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M6 4l15 8-15 8z" />
                            </svg>
                            <span className="font-semibold ml-1">Play all</span>
                        </div>
                    )}

                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1.5 font-medium">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22 7H2v1h20V7zm-9 5H2v-1h11v1zm0 4H2v-1h11v1zm7-5v7l6-3.5-6-3.5z" />
                        </svg>
                        <span>{hasItems ? `${items.length} videos` : "No videos"}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 px-1 mt-2">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <h3
                        className="text-m font-sans font-[600] text-[#f1f1f1] leading-snug line-clamp-2 group-hover:text-white transition-colors duration-200"
                        title={title}
                    >
                        {title}
                    </h3>

                    <div className="flex items-center text-xs font-sans text-gray-400">
                        <span className="text-gray-400 font-[500]">{visibility}</span>
                        <span className="mx-1.5 text-[8px]">•</span>
                        <span className="text-gray-400 font-[500]">Playlist</span>
                    </div>

                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewFull();
                        }}
                        className="text-gray-400 text-sm font-[550] hover:text-white z-3"
                    >
                        View full playlist
                    </div>
                </div>
            </div>
        </div>
    );
}