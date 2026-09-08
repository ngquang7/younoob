import React from 'react';

interface DescriptionBoxProps {
  video: any;
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  getView: (v: string) => string | undefined;
  getTimeago: (d: string) => string;
  getTimeDescription: (d: string) => string;
  getHashtags: (d: string) => string;
  handleDescription: (text: string) => React.ReactNode;
}

export default function DescriptionBox({
  video,
  isExpanded,
  setIsExpanded,
  getView,
  getTimeago,
  getTimeDescription,
  getHashtags,
  handleDescription,
}: DescriptionBoxProps) {
  return (
    <div
      onClick={() => setIsExpanded(true)}
      className={`bg-[#212121] hover:bg-[#282828] rounded-xl p-4 mt-4 transition border border-[#2d2d2d]/30 text-sm leading-relaxed ${
        !isExpanded ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center gap-3 font-semibold text-l text-gray-200 mb-1">
        {isExpanded ? (
          <>
            <span>{video?.statistics?.viewCount} views</span>
            <span>{getTimeDescription(video?.snippet?.publishedAt)}</span>
            <span className="text-[#3ea6ff]">
              {getHashtags(video?.snippet?.description)}
            </span>
          </>
        ) : (
          <>
            <span>{getView(video?.statistics?.viewCount)}</span>
            <span>{getTimeago(video?.snippet?.publishedAt)}</span>
            <span className="text-gray-400">
              {getHashtags(video?.snippet?.description)}
            </span>
          </>
        )}
      </div>

      <div
        className={`font-sans text-gray-300 break-words ${
          !isExpanded ? 'line-clamp-1' : 'whitespace-pre-wrap'
        }`}
      >
        {video?.snippet?.description ? (
          handleDescription(video.snippet.description)
        ) : (
          <div className="italic">No description has been added to this video</div>
        )}
      </div>

      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="flex items-center gap-1 mt-3 text-xs font-semibold"
      >
        {isExpanded ? (
          <button className="w-15 h-7 cursor-pointer hover:bg-gray-700 rounded text-white transition">
            Show less
          </button>
        ) : (
          <div className="cursor-pointer">...more</div>
        )}
      </div>
    </div>
  );
}