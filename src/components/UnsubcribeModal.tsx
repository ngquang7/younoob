interface UnsubscribeModalProps {
    channel: any;
    onClose: () => void;
    onConfirm: () => void;
}

export default function UnsubscribeModal({ channel, onClose, onConfirm }: UnsubscribeModalProps) {
    if (!channel) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]"
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-[#212121] flex-col text-white max-w-[80vh] max-h-[80vh] flex items-center rounded-2xl p-6 shadow-2xl relative"
            >
                <div className="text-gray-400 text-lg">
                    Unsubscribe from <span className="text-white font-bold">{channel?.snippet?.title || "..."}</span> ?
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 mt-5 ml-15 flex hover:bg-[#303030] text-white text-sm font-semibold rounded-full transition cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 mt-5 flex items-end hover:bg-[#303030] text-blue-500 text-sm font-semibold rounded-full transition cursor-pointer"
                    >
                        Unsubscribe
                    </button>
                </div>
            </div>
        </div>
    );
}