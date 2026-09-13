import React from 'react';

interface PlaylistButtonProps {
    video: any;
    onClose: () => void;
    setSelectedVideo: (video: any) => void;
    handleOpenSaveModal: (video: any) => void;
}

export default function PlaylistButton({
    video,
    onClose,
    setSelectedVideo,
    handleOpenSaveModal
}: PlaylistButtonProps) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onClose();
                setSelectedVideo(video);
                handleOpenSaveModal(video);
            }}

            className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left"
        >
            <img alt="Save to playlist" src="/public/savetoplaylist.png" className="h-6 w-5 mr-3" />
            Save to playlist
        </button >
    );
}