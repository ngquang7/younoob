import { useNavigate, useSearchParams } from 'react-router-dom';
import {useState, useEffect} from 'react';
import { video } from 'motion/react-m';
import { searchYouTube, type YoutubeVideo } from '../api/youtubeSearch';
import {getVideosDetails} from "../api/videoWatchInformation";
import {getChannelData} from '../api/channelData';
import { getCommentData } from '../api/commentData';
import type {YouTubeSearchItem, YouTubeVideo}  from "../type";


export default function WatchComponent() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isdisLiked, setDisIsLiked] = useState(false);
  const [isNotice, setisNotice] = useState(false);
  const [isExpandedDecription, setisExpandedDecription] = useState(false);    
  const [isAddComment, setIsAddComment] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  //Share button
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
  const goWatch = (videoidd: string) => {
    navigate(`/watch?v=${videoidd}`);
  }
  //Get videoID
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');
  const [video, setVideo] = useState<any>(null); //Video
  const [video1, setVideo1] = useState<any>(null); //Channel
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (!videoId) return;
    const fetchVideo = async () => {
      setLoading(true);
      try {
        const response = await getVideosDetails(videoId);
        //WE MUST HAVE THIS, IF NOT, WE HAVEN'T LOAD IN4 TO VIDEO YET.
          if (response.items && response.items.length > 0) {
            const videoItem = response.items[0];
            setVideo(response.items[0]);          
            
            const idChannel = videoItem.snippet?.channelId;
            const response1 = await getChannelData(idChannel);         
            if (response1.items && response1.items.length > 0) {
              // setVideo1(response1.items[0]);
              // console.log("Subscriber Count:", video1.statistics.subscriberCount);
            //SHOULD DO THIS METHOD INSTEAD OF THE METHOD ABOVE
            //THIS IS BECAUSE video1 is a React state
            //Calling setVideo1(...) does not instantly update the video1 variable on the next line.
            //Because video1 is still null (or its previous value), trying to read video1.statistics will crash your app with a TypeError.
              const channelItem = response1.items[0]; //Store in a local variable
              setVideo1(channelItem); //Update state
              //console.log("Subscriber Count:", channelItem.statistics?.subscriberCount); //Read from channelItem, NOT the state variable
          }
        }
          const commentResponse = await getCommentData(videoId);
          if(commentResponse.items) {
            const commentItem = commentResponse.items[0];
            setComments(commentResponse.items);
          }
      } catch (error) {
        console.error("Failed to fetch video:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [searchParams]);

  //Up next
  const [upNextVideos, setUpNextVideos] = useState<YouTubeSearchItem[]>([]);
  const currenVideoTitle = video?.snippet?.title || "loading...";
  useEffect(() => {
    //If we dont have this line, it will render the old upnext, because the title haven't load yet, so it will return the old one
    if (!currenVideoTitle || currenVideoTitle.includes("loading")) return;
    const fetchUpNext = async () => {
      try{
        const cleanVideoTitle = currenVideoTitle.split('|')[0].split('-')[0].trim();
        const dataUpNext = await searchYouTube(cleanVideoTitle);
        setUpNextVideos(dataUpNext.items);
      } catch (error) {
        console.log("Error: ", error);
      };
    }
    fetchUpNext();
  },[currenVideoTitle]);




  const channelId = video?.snippet?.channelId || "loading...";
  const navigate = useNavigate();
  const goChannel = () => {
    navigate(`/channel/${channelId}`);
  }

  const [commentText, setCommentText] = useState("");
  const handleSubscribeToggle = () => {
    const nextState = !isSubscribed;
    setIsSubscribed(nextState);

    // 1. Lấy danh sách kênh đã đăng ký cũ từ localStorage
    const savedSubs = JSON.parse(localStorage.getItem('subscribed_channels') || '[]');
    
    // 2. Gom thông tin của kênh hiện tại
    const currentChannel = {
      id: video?.snippet?.channelId || 'unknown_id',
      title: video?.snippet?.channelTitle || 'Channel Name',
      thumbnail: video1?.snippet?.thumbnails?.medium?.url || '', // Ảnh đại diện kênh
    };

    if (nextState) {
      // NẾU BẤM ĐĂNG KÝ (Subscribe): Thêm kênh vào mảng nếu chưa có
      const exists = savedSubs.some((sub: any) => sub.id === currentChannel.id);
      if (!exists) {
        const updatedSubs = [...savedSubs, currentChannel];
        localStorage.setItem('subscribed_channels', JSON.stringify(updatedSubs));
      }
    } else {
      // NẾU BẤM HỦY ĐĂNG KÝ (Unsubscribe): Lọc bỏ kênh này ra khỏi mảng
      const updatedSubs = savedSubs.filter((sub: any) => sub.id !== currentChannel.id);
      localStorage.setItem('subscribed_channels', JSON.stringify(updatedSubs));
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
  e.preventDefault();
  if (!commentText.trim()) return;

  // 1. Tạo object bình luận giả (cấu trúc phải khớp với API)
  const newComment = {
    id: Date.now().toString(), // create a temporary ID 
    snippet: {
      topLevelComment: {
        snippet: {
          authorDisplayName: "Quang (You)", 
          authorProfileImageUrl: "/public/Q.png", // Ảnh avatar tạm
          textDisplay: commentText,
          publishedAt: new Date().toISOString(),
          likeCount: 0
        }
      }
    }
  };
  //cập nhật state (thêm vào đầu danh sách)
  setComments([newComment, ...comments]);
  //total comments + 1 
  if (video && video.statistics) {
    const currentCount = Number(video.statistics.commentCount || 0);
    setVideo({
      ...video,
      statistics: {
        ...video.statistics,
        commentCount: String(currentCount + 1)
      }
    });
  }
  //Reset input và close button
  setCommentText("");
  setIsAddComment(false);
};
  //History video
  useEffect(() => {
    if (video && video.id) {
      // Get the list of history, if it's null, intialize it with empty list
      //JSON.parse convert watch_history from string to array, if it's null, then intialize empty list 
      const existingHistory = JSON.parse(localStorage.getItem('watch_history') || '[]');
      
      // Filter out videos that have already been watched (to avoid repeating the same video)
      const filteredHistory = existingHistory.filter((v: any) => v.id !== video.id);
      
      // Push new video to the top of the list
      const updatedHistory = [video, ...filteredHistory];
      
      // Store in localStorage, convert array to string
      localStorage.setItem('watch_history', JSON.stringify(updatedHistory));
    }
  }, [video]);

//Khi vao lai video của channel đó, mà channel đó đã subcribe thì nó sẽ check, subcribe rồi thì sẽ được giữ nguyên
  useEffect(() => {
    if (video && video.snippet?.channelId) {
      const savedSubs = JSON.parse(localStorage.getItem('subscribed_channels') || '[]');
      
      // Kiểm tra xem ID của kênh hiện tại có nằm trong danh sách đã đăng ký không
      const isSubbed = savedSubs.some((sub: any) => sub.id === video.snippet.channelId);
      
      // Cập nhật lại state của nút Subscribe cho khớp
      setIsSubscribed(isSubbed);
    }
  }, [video]);

  const getSubcriber = (subcriber: string) => {
    const totalSubcriber: number = Number(subcriber);
    if(totalSubcriber < 1000) {
      return `${totalSubcriber}`;
      }
    if(totalSubcriber < 1000000) {
      const subcribers: number = totalSubcriber/1000;
      return `${subcribers}K`;
    }
    if(totalSubcriber < 1000000000) {
      const subcribers: number = totalSubcriber/1000000;
      return `${subcribers}M`;
    }
  }


  const getTimeago = (date: string) => {
      const videoDate = new Date(date);
      const currentTime = new Date();
      const timeAgo = Math.floor((currentTime.getTime() - videoDate.getTime()) / 1000);

      if(timeAgo < 60) return `${timeAgo} seconds ago`; //SECOND
      if (timeAgo < 3600) { // MINUTE
        const minutes = Math.floor(timeAgo / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } 
      if (timeAgo < 86400) { // HOUR
        const hours = Math.floor(timeAgo/3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } 
      if (timeAgo < 604800) { // DAY
        const days = Math.floor(timeAgo / 86400);
        return `${days} day${days > 1 ? 's' : '' } ago`;
      } 
      if (timeAgo < 2592000) { // WEEK
        const weeks = Math.floor(timeAgo / 604800);
        return `${weeks} week${weeks > 1 ? 's' : '' } ago`;
      } 
      if (timeAgo < 31536000) { // MONTH
        const months = Math.floor(timeAgo / 2592000);
        return `${months} month${months > 1 ? 's' : '' } ago`;
      }  
      //YEAR
      const years = Math.floor(timeAgo / 31536000);
      return `${years} year${years > 1 ? 's' : '' } ago`;
    }

  const getView = (view: string) => {
    const totalView: number = Number(view);
    if(totalView < 1000) {
      return `${view} views`
    }
    if(totalView < 1000000) { // < 1M view 
      const views: number = Math.floor(totalView/1000);
      return `${views}K views`;
    }
    if(totalView < 1000000000) {
      const views: number = Math.floor(totalView/1000000);
      return `${views}M views`;
    }
    if(totalView < 1000000000000) {
      const views: number = Math.floor(totalView/1000000000);
      return `${views}B views`; 
    }
  }

  const getTimeDescription = (date: string) => {
    const videoDate = new Date(date);
    const dayandmonth: string = videoDate.toDateString().slice(4,10);
    const year: string = videoDate.toDateString().slice(11,16);
    return `${dayandmonth}, ${year}`;
    }

  const getLike = (like: string) => {
    const totalLike: number = Number(like);
    if(totalLike < 1000) {
      return `${like}`
    }
    if(totalLike < 1000000) { // < 1M view 
      const likes: number = Math.floor(totalLike/1000);
      return `${likes}K`;
    }
    if(totalLike < 1000000000) {
      const likes: number = Math.floor(totalLike/1000000);
      return `${likes}M`;
    }
    if(totalLike < 1000000000000) {
      const likes: number = Math.floor(totalLike/1000000000);
      return `${likes}B`; 
    }
  }

  return (
    // 
  <div className="w-full mx-auto px-4 py-0 flex flex-col lg:flex-row gap-5 text-[#f1f1f1]">
      
      {/* Left Column (Video Player + Description + Comments) */}
      <div className="flex-1 min-w-0">
        
        {/* Responsive Video Container */}
        {/* width video, w-full, it will be automatically suitable */}
        <div className="w-full rounded-2xl overflow-hidden aspect-video bg-black shadow-2xl border border-[#212121]">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

      {/* Video Title */}
        <h1 className="text-lg md:text-xl font-sans font-bold mt-4 leading-snug">
          {video?.snippet?.title || "..Loading.."}
        </h1>

        {/* Action Controls & Channel Details Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-3 pb-4 border-b border-[#2d2d2d]">
          {/* Channel Avatar & Subscribers & Subscribe Trigger */}
          <div className="flex items-center gap-3">
            <img
              src={video1?.snippet?.thumbnails.medium?.url || "..Loading.."}
            //   alt={video.channelTitle}
              className="w-10 h-10 rounded-full object-cover border border-[#303030]"
            />
            <div className="flex flex-col">
              <span onClick={goChannel} className="font-sans font-semibold text-sm hover:text-white cursor-pointer">{video?.snippet?.channelTitle || "Loading..."}</span>
              <span className="text-xs text-gray-400">{getSubcriber(video1?.statistics?.subscriberCount)} subscribers</span>
            </div>
            
            <button
              onClick={handleSubscribeToggle}
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
                {getLike(video?.statistics?.likeCount)} likes
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
            

            {/* SHARE */}
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

        {/* DESCRIPTION CARD */}
        <div
          onClick={() => setisExpandedDecription(true)} 
          className={`bg-[#212121] hover:bg-[#282828] rounded-xl p-4 mt-4 transition border border-[#2d2d2d]/30 text-sm leading-relaxed ${!isExpandedDecription ? 'cursor-pointer' : ''}`}
        >
          {/* VIEW in description */}
          <div className="flex items-center gap-3 font-semibold text-l text-gray-200 mb-1">

            {isExpandedDecription ? (
              <>
              <span>{video?.statistics?.viewCount}</span>
              <span>{getTimeDescription(video?.snippet?.publishedAt)}</span>
              </>
            ) : (
              <>
                  {/* {getView(video?.statistics?.viewCount)} */}
                  {/* {video?.statistics?.viewCount} */}
                <span>{getView(video?.statistics?.viewCount)}</span>
                <span>{getTimeago(video?.snippet?.publishedAt)}</span>
              </>
            )}
          </div>

          {/* DESCRIPTION */}
          {/* line-clamp2 and whitespace-pre-wrap, process data received from YOUTUBE API */}
          <div className={`font-sans text-gray-300 break-words ${!isExpandedDecription ? 'line-clamp-1' : 'whitespace-pre-wrap'}`}>
            {video?.snippet?.description || <div className="italic">No description has been added to this video</div>} 
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              setisExpandedDecription(!isExpandedDecription);
            }}
            className="flex items-center gap-1 mt-3 text-xs font-semibold"
          >
            {isExpandedDecription ? (
              <>
                <button className="w-15 h-7 cursor-pointer hover:bg-gray-700 rounded text-white transition cursor-pointer">Show less</button>
              </>
            ) : (
              <>
                <div className="cursor-pointer">...more</div>
              </>
            )}
          </div>
        </div>
        
      {/* COMMENTS */}
      <div className="mt-6">

        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-base font-bold tracking-tight font-sans">
          {video?.statistics?.commentCount || "Loading..."} Comments
          </h1>
        </div>
        {/* MY COMMENT */}
        <form onSubmit={handlePostComment} className="flex gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-[#392937] overflow-hidden shrink-0 flex items-center justify-center font-sans font-bold text-sm text-white">
              Q
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)} // Lưu nội dung nhập
              onClick={() => setIsAddComment(true)}
              placeholder="Add a comment..."
              className="w-full bg-transparent border-b border-[#303030] focus:border-white focus:outline-none py-1.5 text-sm text-[#f1f1f1] transition-colors placeholder-gray-500"
            />
              <div className="flex justify-end gap-2 animate-in fade-in duration-100">
                {isAddComment &&
                <>
                <button 
                  onClick={() => {
                    setIsAddComment(false);
                    setCommentText("");
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-black-500 hover:bg-gray-800 rounded-full text-white transition cursor-pointer"
                  >
                  Cancel
                </button>
                {/* type="submit" */}
                <button type="submit" className="px-3.5 py-1.5 text-xs font-semibold bg-blue-500 hover:bg-blue-600 rounded-full text-white transition cursor-pointer">
                  Comment
                </button>
                </>
                  }
              </div>    
          </div>
        </form>
        {/* Insert a comment into comments list */}
        {comments.map((item) => {
          const comment = item.snippet.topLevelComment.snippet;
          return (
              <div key={item.id} className="flex gap-4">
                  <img 
                      src={comment.authorProfileImageUrl} 
                      className="w-10 h-10 rounded-full cursor-pointer" 
                      alt="avatar"
                      onClick={() => setPreviewImage(comment.authorProfileImageUrl)}
                  />
                  <div className="flex flex-col mb-8">
                      <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{comment.authorDisplayName}</span>
                          <span className="text-xs text-gray-500">{getTimeago(comment.publishedAt)}</span>
                      </div>
                      <p className="text-sm mt-1 text-gray-200">{comment.textDisplay}</p>
                      <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-400">👍 {comment.likeCount}</span>
                      </div>
                  </div>
                  {previewImage && (
                    <div 
                      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                      onClick={() => setPreviewImage(null)}
                    >
                        {/* Want preview bigger ? Modify w-64 h-64 */}
                        <img 
                          src={previewImage} 
                          alt="Preview Large" 
                          className="w-200 h-200 rounded-full object-cover shadow-lg border-4 border-gray-600"
                        />
                      </div>
                  )}
              </div>
            );
        })}
    </div>
  </div>
    
      {/* RIGHT COLUMN (SIDEBAR FEED) */}
      <div className="w-200 lg:w-[300px] shrink-0 flex flex-col gap-4">
        <h3 className="font-sans font-semibold text-sm text-gray-400 mb-1 px-1">Up Next</h3>
        {upNextVideos.map((video) => (
          <div
          onClick={() => {
            if (video.id.videoId) {
              goWatch(video.id.videoId);
            }
          }}
            className="flex gap-3 group cursor-pointer hover:bg-[#272727]"
          >
            {/* Mini Thumbnail */}
            <div className="relative w-40 aspect-video rounded-lg overflow-hidden shrink-0 bg-[#212121]">
              <img
                src={video?.snippet?.thumbnails.default?.url || "null"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Duration */}
              {/* <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[10px] font-medium text-white">
                duration
              </span> */}
            </div>

            {/* Mini details */}
            <div className="flex-1 min-w-0 flex flex-col gap-1 py-0.5">
              <h4 className="text-xs font-semibold leading-snug line-clamp-2 text-[#f1f1f1] group-hover:text-white transition-colors">
                {video?.snippet?.title || "Loading"}
              </h4>
              <div className="flex flex-col gap-0.5 text-[11px] text-gray-400">
                <span className="truncate hover:text-white">{video?.snippet?.channelTitle || "Loading"}</span>
                <div className="flex items-center truncate">
                  {/* <span>views</span> */}
                  {/* <span className="mx-1 text-[6px]">•</span> */}
                  <span>{getTimeago(video?.snippet?.publishedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
  </div>

    );
}