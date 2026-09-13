import React from 'react';

interface ShareButtonProps {
    onOpenShareModal: () => void;
}

export default function ShareButton({onOpenShareModal }: ShareButtonProps) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onOpenShareModal();  
            }}
            className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left"
        >
            <img alt="Share" src="/public/share.png" className="h-5 w-5 mr-3" />
            Share
        </button>
    );
}