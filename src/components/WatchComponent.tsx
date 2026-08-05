import { useSearchParams } from 'react-router-dom';
import {useState, useEffect} from 'react';
import { video } from 'motion/react-m';
import type { YoutubeVideo } from '../api/youtubeSearch';
import {getVideosDetails} from "../api/videoWatchInformation";

import axios from 'axios'
export default function WatchComponent() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isdisLiked, setDisIsLiked] = useState(false);
    const [isNotice, setisNotice] = useState(false);
    const [isExpandedDecription, setisExpandedDecription] = useState(false);    


    const handleShareClick = () => {
    const shareUrl = `https://youtube.com/watch?v=${videoId}`;
      try {
        navigator.clipboard.writeText(shareUrl);
        setisNotice(true);
        setTimeout ( () => {
          setisNotice(false);
        }, 2300);
      } catch (error) {
        console.warn("Copy failed ", error);
      }
    };

  if(isExpandedDecription === false){

  }

  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');


  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (!videoId) return;

    const fetchVideo = async () => {
      setLoading(true);
      try {
        const response = await getVideosDetails(videoId);

        response.items.forEach(video => {
          console.log("Title:", video.snippet.title);
          console.log("Description:", video.snippet.description);
          console.log("Channel:", video.snippet.channelTitle);
          console.log("Views:", video.statistics?.viewCount);
          console.log("Likes:", video.statistics?.likeCount);
        });

        //WE MUST HAVE THIS, IF NOT, WE HAVEN'T LOAD IN4 TO VIDEO YET.
        if (response.items && response.items.length > 0) {
          setVideo(response.items[0]);
        }
        
      } catch (error) {
        console.error("Failed to fetch video:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [searchParams]);


  return (
    // 
  <div className="max-w-[1440px] mx-auto px-4 py-6 mt-14 flex flex-col lg:flex-row gap-6 text-[#f1f1f1]">
      
      {/* Left Column (Video Player + Description + Comments) */}
      <div className="flex-1 min-w-0">
        
        {/* Responsive Video Container */}
        {/* width video, */}
        <div className="w-200 rounded-2xl overflow-hidden aspect-video bg-black shadow-2xl border border-[#212121]">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

    {/* Video Title */}
        <h1 className="text-lg md:text-xl font-sans font-bold mt-4 leading-snug">
          {video?.snippet?.title || "Loading"}
        </h1>

        {/* Action Controls & Channel Details Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-3 pb-4 border-b border-[#2d2d2d]">
          {/* Channel Avatar & Subscribers & Subscribe Trigger */}
          <div className="flex items-center gap-3">
            <img
              src={video?.Channel?.Avatar || "null"}
            //   alt={video.channelTitle}
              className="w-10 h-10 rounded-full object-cover border border-[#303030]"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="font-sans font-semibold text-sm hover:text-white cursor-pointer">{video?.snippet?.channelTitle || "Loading..."}</span>
              <span className="text-xs text-gray-400">n subscribers</span>
            </div>
            
            <button
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={`gap-1 ml-3 px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition active:scale-95 ${
                isSubscribed 
                  ? 'bg-[#212121] hover:bg-[#303030] border border-[#404040] text-[#f1f1f1]' 
                  : 'bg-white hover:bg-gray-200 text-black'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>
          
          {/* Action buttons (Likes, Share, Save) */}
          <div className="flex items-center gap-2 overflow-x-auto py-0">
            {/* Likes */}
            <div className="flex items-center bg-[#212121] rounded-full border border-[#303030]/50 shrink-0">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-1.5 px-4 py-2 hover:bg-[#303030] rounded-l-full border-r border-[#303030] transition text-xs font-semibold cursor-pointer
                ${
                  isLiked ? 'text-[#ff0000]' : 'text-[#f1f1f1]'
                }`}
              >
                {video?.statistics?.likeCount || "Loading..."}Like
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
              onClick={handleShareClick}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#212121] hover:bg-[#303030] border border-[#303030]/50 rounded-full transition text-xs font-semibold shrink-0 cursor-pointer"
            >

              <span>Share</span>
            </button>
                        {isNotice && (
        <div className="fixed bottom-5 left-1/2 px-4 py-2 bg-green-800 text-white text-xs font-semibold rounded-lg shadow-lg transition-all animate-fade-in">
          Copy link Successfull !
        </div>
      )}
          </div>
        </div>

        {/* Expandable Description Card */}
        <div
          onClick={() => setisExpandedDecription(true)} 
          className={`bg-[#212121] hover:bg-[#282828] rounded-xl p-4 mt-4 transition border border-[#2d2d2d]/30 text-sm leading-relaxed ${!isExpandedDecription ? 'cursor-pointer' : ''}`}
        >
          {/* VIEW  */}
          <div className="flex items-center gap-3 font-semibold text-xs text-gray-200 mb-1">
            <span>{video?.statistics?.viewCount} views</span>
          </div>
        {/* line-clamp2 and whitespace-pre-wrap, process data received from YOUTUBE API */}
          <p className={`font-sans text-gray-300 break-words ${!isExpandedDecription ? 'line-clamp-1' : 'whitespace-pre-wrap'}`}>
            {video?.snippet?.description || "Loading..."} 
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setisExpandedDecription(!isExpandedDecription);
            }}
            className="flex items-center gap-1 mt-3 text-xs font-semibold"
          >
            {isExpandedDecription ? (
              <>
                <button className="w-3.5 h-3.5 cursor-pointer hover:underline text-white cursor-pointer">Less</button>
              </>
            ) : (
              <>
                <div className="cursor-pointer">more...</div>
              </>
            )}
          </button>

        </div>
    </div>
    
      {/* Right Column (Recommended Sidebar Feed) */}
      <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-4">
        <h3 className="font-sans font-semibold text-sm text-gray-400 mb-1 px-1">Up Next</h3>

            {/* Mini Thumbnail */}
            

            {/* Mini details */}
      </div>
  </div>



    );
}