import React from 'react';

interface SaveToWatchLaterProps {
  watchLaterVideoList: any[];
  isSaved: boolean;
  onToggleSave: () => void;
}

export default function SaveToWatchLater({
  watchLaterVideoList,
  isSaved,
  onToggleSave,
}: SaveToWatchLaterProps) {
  const hasVideos = watchLaterVideoList.length > 0;
  const firstVideoThumb = watchLaterVideoList[0]?.snippet?.thumbnails?.medium?.url || '/loading1.png';

  return (
    <div 
      onClick={onToggleSave}
      className="w-full px-5 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left"
    >
      <div className="flex flex-row items-center w-full">
        <div className="relative w-28 h-8 flex-shrink-0">
          <div className="absolute -top-2 left-3 right-2 h-8 w-[55px] bg-[#737373] rounded-md"></div>
          <img
            src={firstVideoThumb}
            alt="Watch Later preview"
            className="h-[35px] w-[65px] absolute ml-2 inset-0 rounded-md overflow-hidden border border-black/40 object-cover"
          />
        </div>

        <div className="flex flex-col ml-2">
          <span className="text-sm font-medium">Watch later</span>
          <span className="text-xs text-neutral-400">Private</span>
        </div>

        <div className="ml-auto text-neutral-300">
          <img
            src={isSaved ? "/public/savedVideo.png" : "/public/savetoplaylist.png"}
            alt="Save status"
            className="h-6 w-5"
          />
        </div>
      </div>
    </div>
  );
}