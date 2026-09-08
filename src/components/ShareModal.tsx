import React, { useState } from 'react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoId: string;
    videoTitle?: string;
    showNotice?: (message: string) => void; // Nhận hàm showNotice dùng chung
}

export default function ShareModal({
    isOpen,
    onClose,
    videoId,
    videoTitle = '',
    showNotice,

}: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    // Xử lý làm sạch title (xóa chữ "(playlist)" nếu có)
    const cleanTitle = videoTitle.replace(/\s*\(playlist\)/gi, '').trim();
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

    /* SHARE HANDLERS */
    const handleShareFacebook = () => {
        if (!videoId) return;
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(youtubeUrl)}`;
        window.open(facebookShareUrl, '_blank');
    };

    const handleShareX = () => {
        if (!videoId) return;
        const text = encodeURIComponent(cleanTitle);
        const xShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(youtubeUrl)}&text=${text}`;
        window.open(xShareUrl, '_blank');
    };

    const handleShareLinkedin = () => {
        if (!videoId) return;
        const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(youtubeUrl)}`;
        window.open(linkedinShareUrl, '_blank');
    };

    const handleShareReddit = () => {
        if (!videoId) return;
        const text = encodeURIComponent(cleanTitle);
        const redditShareUrl = `https://reddit.com/submit?url=${encodeURIComponent(youtubeUrl)}&title=${text}`;
        window.open(redditShareUrl, '_blank');
    };

    // Tích hợp gọn logic copy và gọi showNotice trực tiếp ở đây
    const handleCopyClick = () => {
        try {
            navigator.clipboard.writeText(youtubeUrl);
            setCopied(true);

            if (showNotice) {
                showNotice("Copy successfully");
            }

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.warn("Copy failed ", error);
            if (showNotice) {
                showNotice("Copy failed!");
            }
        }
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center cursor-default bg-black/50"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-[#212121] text-white w-[400px] max-h-[80vh] overflow-y-auto rounded-2xl p-6 shadow-2xl relative [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#555] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl w-10 h-10 rounded-full cursor-pointer flex items-center justify-center"
                >
                    ✕
                </button>
                <h2 className="text-xl font-bold mb-6 flex items-center justify-center">
                    Share
                </h2>
                <div className="flex flex-row gap-3 justify-center">
                    <button
                        className="flex flex-col items-center cursor-pointer"
                        onClick={handleShareFacebook}
                    >
                        <img
                            alt="Facebook"
                            src="/facebook.png"
                            className="rounded-full object-cover h-15 w-15 mb-2 cursor-pointer"
                        />
                        Facebook
                    </button>

                    <button
                        className="flex flex-col items-center cursor-pointer"
                        onClick={handleShareX}
                    >
                        <img
                            alt="X"
                            src="/X.png"
                            className="rounded-full object-cover h-17 w-18 cursor-pointer"
                        />
                        X
                    </button>

                    <button
                        className="flex flex-col items-center cursor-pointer -ml-2"
                        onClick={handleShareLinkedin}
                    >
                        <img
                            alt="LinkedIn"
                            src="/linkedin.png"
                            className="rounded-full object-cover h-17 w-18 cursor-pointer"
                        />
                        Linked
                    </button>

                    <button
                        className="flex flex-col items-center cursor-pointer"
                        onClick={handleShareReddit}
                    >
                        <img
                            alt="Reddit"
                            src="/reddit.png"
                            className="rounded-full object-cover mb-2 h-15 w-15 cursor-pointer"
                        />
                        Reddit
                    </button>
                </div>

                <div className="flex items-center bg-[#1f1f1f] border border-neutral-700 rounded-xl p-2 max-w-md mt-5">
                    <input
                        type="text"
                        readOnly
                        value={youtubeUrl}
                        onClick={(e) => e.currentTarget.select()}
                        className="w-full bg-transparent text-white text-sm px-3 outline-none cursor-text select-all truncate selection:bg-blue-600"
                    />

                    <button
                        onClick={handleCopyClick}
                        className="bg-white hover:bg-neutral-200 text-black font-medium px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap ml-2 cursor-pointer"
                    >
                        Copy
                    </button>
                </div>
            </div>
        </div>
    );
}