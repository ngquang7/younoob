import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { formatDateTime } from '../../utils/formatDateTime';
import { formatView } from '../../utils/formatView';
import { formatNumberUsStyle } from '../../utils/formatNumberUsStyle';
import { formatSubcriberCount } from '../../utils/formatSubcriberCount';
interface DescriptionBoxProps {
  video: any;
  video1: any;
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  getHashtags: (d: string) => string;
  handleDescription: (text: string) => React.ReactNode;
}

export default function DescriptionBox({
  video,
  video1,
  isExpanded,
  setIsExpanded,
  getHashtags,
  handleDescription,
}: DescriptionBoxProps) {
      const navigate = useNavigate();
    const channelId = video?.snippet?.channelId || "loading...";
      const goChannel = () => navigate(`/channel/${channelId}`);
  return (
    <div
      onClick={() => setIsExpanded(true)}
      className={`bg-[#212121] hover:bg-[#282828] rounded-xl p-4 mt-4 transition border border-[#2d2d2d]/30 text-sm leading-relaxed ${!isExpanded ? 'cursor-pointer' : ''
        }`}
    >
      <div className="flex items-center gap-3 font-semibold text-l text-gray-200 mb-1">
        {isExpanded ? (
          <>
            <span>{formatNumberUsStyle(video?.statistics?.viewCount)} views</span>
            <span>{formatDateTime(video?.snippet?.publishedAt)}</span>
            <span className="text-[#3ea6ff]">
              {getHashtags(video?.snippet?.description)}
            </span>
          </>
        ) : (
          <>
            <span>{formatView(video?.statistics?.viewCount)} views</span>
            <span>{formatTimeAgo(video?.snippet?.publishedAt)}</span>
            <span className="text-gray-400">
              {getHashtags(video?.snippet?.description)}
            </span>
          </>
        )}
      </div>

      <div
        className={`font-sans text-gray-300 break-words ${!isExpanded ? 'line-clamp-1' : 'whitespace-pre-wrap'
          }`}
      >
        {video?.snippet?.description ? (
          <>
          <div>
            {handleDescription(video.snippet.description)}
            <div>
                    <div className="flex items-center gap-3 mt-10">
                      <img
                        onClick={goChannel}
                        src={video1?.snippet?.thumbnails?.medium?.url || "..Loading.."}
                        className="w-10 h-10 rounded-full cursor-pointer object-cover border border-[#303030]"
                        alt="Channel Avatar"
                      />
                      <div className="flex flex-col">
                        <span
                          onClick={goChannel}
                          className="font-sans font-bold text-[20px] hover:cursor-pointer"
                        >
                          {video?.snippet?.channelTitle || "Loading..."}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatSubcriberCount(video1?.statistics?.subscriberCount)} subscribers
                        </span>
                        </div>
                      </div>
            </div>
          </div>
          </>
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