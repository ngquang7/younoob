import React, { useState } from 'react';
import { 
  getYouTubeUrl, 
  shareToFacebook, 
  shareToX, 
  shareToLinkedin, 
  shareToReddit, 
  handleCopyURL 
} from '../../utils/shareUtils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  videoTitle?: string;
  showNotice?: (message: string) => void;
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

  const youtubeUrl = getYouTubeUrl(videoId);

  const onCopyClick = () => {
    handleCopyURL(videoId, showNotice);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
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
            onClick={() => shareToFacebook(videoId)}
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
            onClick={() => shareToX(videoId, videoTitle)}
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
            onClick={() => shareToLinkedin(videoId)}
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
            onClick={() => shareToReddit(videoId, videoTitle)}
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
            onClick={onCopyClick}
            className={`font-medium px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap ml-2 cursor-pointer ${
              copied 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-white text-black hover:bg-neutral-200'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}