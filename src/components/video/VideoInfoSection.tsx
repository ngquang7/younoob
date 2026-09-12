import { formatSubcriberCount } from '../../utils/formatSubcriberCount';

interface VideoInfoSectionProps {
  video: any;
  video1: any;
  videoId: string | null;
  goChannel: () => void;
  getLike: (like: string) => string;
  isSubscribed: boolean;
  handleSubscribeToggle: () => void;
  isLiked: boolean;
  handleLikeToggle: () => void;
  isdisLiked: boolean;
  setIsDisLiked: (val: boolean) => void;
  isSaved: boolean;
  handleSaveToggle: () => void;
  onOpenShare: () => void;
}

export default function VideoInfoSection({
  video,
  video1,
  videoId,
  goChannel,
  getLike,
  isSubscribed,
  handleSubscribeToggle,
  isLiked,
  handleLikeToggle,
  isdisLiked,
  setIsDisLiked,
  isSaved,
  handleSaveToggle,
  onOpenShare,
}: VideoInfoSectionProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-3 pb-4 border-b border-[#2d2d2d]">
      {/* CHANNEL INFO & SUBSCRIBE */}
      <div className="flex items-center gap-3">
        <img
          src={video1?.snippet?.thumbnails?.medium?.url || "..Loading.."}
          className="w-10 h-10 rounded-full object-cover border border-[#303030]"
          alt="Channel Avatar"
        />
        <div className="flex flex-col">
          <span
            onClick={goChannel}
            className="font-sans font-semibold text-sm hover:text-white cursor-pointer"
          >
            {video?.snippet?.channelTitle || "Loading..."}
          </span>
          <span className="text-xs text-gray-400">
            {formatSubcriberCount(video1?.statistics?.subscriberCount)} subscribers
          </span>
        </div>

        <button
          onClick={handleSubscribeToggle}
          className={`gap-1 px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition active:scale-95 ${
            isSubscribed
              ? 'bg-[#212121] hover:bg-[#303030] border border-[#404040] text-[#f1f1f1]'
              : 'bg-white hover:bg-gray-200 text-black'
          }`}
        >
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
        </button>
      </div>

      {/* ACTIONS (Like, Dislike, Save, Share, Youtube) */}
      <div className="flex items-center gap-2 overflow-x-auto py-0">
        {/* Like & Dislike Group */}
        <div className="flex items-center bg-[#212121] rounded-full border border-[#303030]/50 shrink-0">
          <button
            onClick={handleLikeToggle}
            className="flex items-center gap-1.5 px-4 py-2 hover:bg-[#303030] rounded-l-full border-r border-[#303030] transition text-xs font-semibold cursor-pointer text-[#f1f1f1]">
            {isLiked ? <img src="/public/liked.png" className="w-5 h-5" alt="Liked" /> : <img src="/public/notlike.png" className="w-5 h-5" alt="Like" />}
            {video?.statistics?.likeCount !== undefined ? getLike(video?.statistics?.likeCount)  : 'Like'} 
          </button>
          <button
            onClick={() => setIsDisLiked(!isdisLiked)}
            className={`px-4 py-2 hover:bg-[#303030] rounded-r-full text-[#f1f1f1] flex items-center gap-1.5 transition text-xs font-semibold cursor-pointer text-[#f1f1f1]`}
          >
            {/* ${isdisLiked ? 'text-[#ff0000]' : 'text-[#f1f1f1]' */}
            {isdisLiked ? <img src="/public/disliked.png" className="w-5 h-5" alt="Disliked" /> : <img src="/public/notdislike.png" className="w-5 h-5" alt="Dislike" />}
            dislike
          </button>
        </div>

        {/* Watch Later / Save */}
        <button
          onClick={handleSaveToggle}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#303030]/50 transition text-xs font-semibold shrink-0 cursor-pointer ${
            isSaved
              ? 'bg-emerald-950/40 hover:bg-emerald-900/40 text-green-400 border-emerald-800/80'
              : 'bg-[#212121] hover:bg-[#303030]'
          }`}
        >
          {isSaved ? (
            'Saved'
          ) : (
            <>
              <img src="/public/savetoplaylist.png" className="h-4 w-4" alt="Save" />
              Watch Later
            </>
          )}
        </button>

        {/* Share */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenShare();
          }}
          className="flex items-center px-4 py-2 bg-[#212121] hover:bg-[#303030] border border-[#303030]/50 rounded-full transition text-xs font-semibold shrink-0 cursor-pointer"
        >
          <img alt="Share" src="/public/share.png" className="h-4 w-4 mr-2" />
          Share
        </button>

        {/* Open on YouTube */}
        <button
          onClick={() => window.open(`https://youtube.com/watch?v=${videoId}`, '_blank')}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#212121] hover:bg-[#303030] border border-[#303030]/50 rounded-full transition text-xs font-semibold shrink-0 cursor-pointer"
        >
          Youtube
        </button>
      </div>
    </div>
  );
}