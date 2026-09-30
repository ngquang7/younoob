interface PauseHistorylProps {
    state: boolean;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function PauseHistoryModal({ state, isOpen, onClose, onConfirm }: PauseHistorylProps) {
    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-[#212121] flex-col text-white max-w-[80vh] max-h-[80vh] flex items-center rounded-2xl p-6 shadow-2xl relative [scrollbar-width:none]"
            >
                <div className="text-white text-xl w-full mb-5 text-left">
                    {state ? 'Turn on watch history?' : 'Pause watch history?'}
                </div>
                <p className="text-gray-400 text-sm text-left flex w-full mb-5">
                    {state ? 
                    'Your private YouTube watch history makes your recently watched videos on YouTube easy to find and improves recommendations in YouTube and other Google products.' 
                    : 
                    'Pausing YouTube watch history can make it harder to find videos you watched, and you may see fewer recommendations for new videos in YouTube and other Google products.'}
                </p>
                <p className="text-gray-400 text-sm text-left leading-relaxed">
                    {state ? 
                    'When YouTube watch history is on, this data may be saved from any of your signed-in devices. You can always control and review your activity at My Account.' 
                    : 'Remember, pausing this setting does not delete any previous activity, but you can view, edit and delete your private YouTube watch history data anytime. When you pause and clear your watch history, YouTube features that rely on history to personalize your experience are disabled.'}
                </p>

                <div className="flex items-center gap-3 w-full justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 mt-5 hover:bg-[#303030] text-white text-sm font-semibold rounded-full transition cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 mt-5 hover:bg-[#303030] text-blue-500 text-sm font-semibold rounded-full transition cursor-pointer"
                        onClick={onConfirm}
                    >
                        {state ? 'Turn on' : 'Pause'}
                    </button>
                </div>
            </div>
        </div>
    );
}