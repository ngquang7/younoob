import React from 'react';

interface RemoveButtonProps {
    videoId: string;
    label?: string;
    onClose: () => void;
    remove: (id: string) => void;
}

export default function RemoveButton({ 
    videoId,
    label = "Remove", 
    onClose,
    remove 
}: RemoveButtonProps) {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
        remove(videoId);
    };

    return (
        <button
            onClick={handleClick}
            className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left rounded-b-xl"
        >
            <img alt="Remove" src="/public/bin.png" className="h-5 w-5 mr-3 pointer-events-none" />
            {label}
        </button>
    );
}