import {useState} from 'react';
export default function WatchComponent() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isdisLiked, setDisIsLiked] = useState(false);

  return (
    // 
  <div className="max-w-[1440px] mx-auto px-4 py-6 mt-14 flex flex-col lg:flex-row gap-6 text-[#f1f1f1]">
      
      {/* Left Column (Video Player + Description + Comments) */}
      <div className="flex-1 min-w-0">
        
        {/* Responsive Video Container */}
        {/* width video, */}
        <div className="w-200 rounded-2xl overflow-hidden aspect-video bg-black shadow-2xl border border-[#212121]">
          <iframe
            // src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
            // title={video.title}
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        {/* Video Title */}
        <h1 className="text-lg md:text-xl font-sans font-bold mt-4 leading-snug">
          {/* {video.title} */}
        </h1>

        {/* Action Controls & Channel Details Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-3 pb-4 border-b border-[#2d2d2d]">
          {/* Channel Avatar & Subscribers & Subscribe Trigger */}
          <div className="flex items-center gap-3">
            <img
            //   src={video.channelAvatar}
            //   alt={video.channelTitle}
              className="w-10 h-10 rounded-full object-cover border border-[#303030]"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="font-sans font-semibold text-sm hover:text-white cursor-pointer">videochannelTitle</span>
              <span className="text-xs text-gray-400">n subscribers</span>
            </div>
            
            <button
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={`ml-3 px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition active:scale-95 ${
                isSubscribed 
                  ? 'bg-[#212121] hover:bg-[#303030] border border-[#404040] text-[#f1f1f1]' 
                  : 'bg-white hover:bg-gray-200 text-black'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>
          
          {/* Action buttons (Likes, Share, Save) */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {/* Likes */}
            <div className="flex items-center bg-[#212121] rounded-full border border-[#303030]/50 shrink-0">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-1.5 px-4 py-2 hover:bg-[#303030] rounded-l-full border-r border-[#303030] transition text-xs font-semibold cursor-pointer
                ${
                  isLiked ? 'text-[#ff0000]' : 'text-[#f1f1f1]'
                }`}
              >
                Like
              </button>
                {/* dislike button */}
                  {/* Pay attention to hover */}
              <button
              onClick={() => setDisIsLiked(!isdisLiked)}
              className={`px-4 py-2 hover:bg-[#303030] rounded-r-full text-[#f1f1f1] transition text-xs font-semibold cursor-pointer
              ${
                isdisLiked ? 'text-[#ff0000]' : 'text-[#f1f1f1]'
              }`}
              >
                dislike
              </button>
              
            </div> 

            {/* Save (Watch Later) */}
            

            {/* Share */}
            <button
            //   onClick={handleShareClick}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#212121] hover:bg-[#303030] border border-[#303030]/50 rounded-full transition text-xs font-semibold shrink-0 cursor-pointer"
            >
              {/* <Share2 className="w-4 h-4" /> */}
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Expandable Description Card */}


      {/* Right Column (Recommended Sidebar Feed) */}
      <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-4">
        <h3 className="font-sans font-semibold text-sm text-gray-400 mb-1 px-1">Up Next</h3>

            {/* Mini Thumbnail */}
            

            {/* Mini details */}
            
        
      </div>

    </div>
  </div>
    );
}