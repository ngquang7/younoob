import React from 'react';
import { storageService } from '../../hooks/storageService';

interface SaveToWatchLaterButtonProps {
    video: any;
    onClose: () => void;
    showNotice?: (message: string) => void;
    setWatchLaterVideoList: React.Dispatch<React.SetStateAction<any[]>>;
    setIsSaved: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SaveToWatchLaterButton({ 
    video, 
    onClose, 
    showNotice, 
    setWatchLaterVideoList, 
    setIsSaved 
}: SaveToWatchLaterButtonProps) {

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!video || !video.id) return;
        storageService.addToSaved(video);
        const updated = storageService.getSaved();
        setWatchLaterVideoList(updated);
        setIsSaved(true);
        if (showNotice) {
            showNotice("Saved to Watch Later");
        }
        onClose();
    };

    return (
        <button
            onClick={handleSave}
            className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left"
        >
            <img alt="Save to watch later" src="/public/savetowatchlater.png" className="h-6 w-6 mr-3" />
            Save to watch later
        </button>
    );
}