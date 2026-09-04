import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { searchYouTube} from '../api/youtubeSearch';
import { getVideosDetails } from "../api/videoWatchingData";
import { getChannelData } from '../api/channelData';
import { getCommentData } from '../api/commentData';
import type { YouTubeSearchItem} from "../type";

export default function WatchComponent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');
  const listId = searchParams.get('list');
  const listType = searchParams.get('list') === 'WL';

  const [video, setVideo] = useState<any>(null); //Video
  const [video1, setVideo1] = useState<any>(null); //Channel
  const [playListVideo, setPlayListVideo] = useState<any[]>([]); //For playlist video
  const [upNextVideos, setUpNextVideos] = useState<YouTubeSearchItem[]>([]); //For up next if it's not playlist
  const [comments, setComments] = useState<any[]>([]); //Comment
  const [watchLaterVideoList, setWatchLaterVideoList] = useState<any[]>([]); //For up next
  const [loading, setLoading] = useState<boolean>(false);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSavedUpNext, setIsSavedUpNext] = useState(false);
  const [isdisLiked, setDisIsLiked] = useState(false);
  const [isNotice, setisNotice] = useState(false);
  const [isExpandedDecription, setisExpandedDecription] = useState(false);
  const [isAddComment, setIsAddComment] = useState(false);
  const [isShareModal, setIsShareModal] = useState(false);
  const [isShareModalUpNext, setIsShareModalUpNext] = useState(false);

  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const currenVideoTitle = video?.snippet?.title || "loading...";
  const channelId = video?.snippet?.channelId || "loading...";

  /*G0 TO CHANNEL, VIDEO & SHOW NOTICE */
    const goChannel = () => navigate(`/channel/${channelId}`);
    const goWatch = (videoidd: string) => {
      navigate(`/watch?v=${videoidd}`);
    }
    const showNotice = (message: string) => {
      setNoticeMessage(message);
      setTimeout(() => {
        setNoticeMessage(null);
      }, 2300);
    };
  //

  /* GET DATA OF VIDEO FROM API YOUTUBE V3 (getVideoDetails, getChannelData, get CommentData) */
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
          if (commentResponse.items) {
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

    useEffect(() => {
      if (listId === 'LL') {
        const savedLikedVideos = JSON.parse(localStorage.getItem('like_video') || '[]');
        setPlayListVideo(savedLikedVideos);
      } else if (listId === 'WL') {
        const savedSavedVideos = JSON.parse(localStorage.getItem('saved_video') || '[]');
        setPlayListVideo(savedSavedVideos);
      }
      else {
        return;
      }
    }, [])

    /* UP NEXT */
    useEffect(() => {
      //If we dont have this line, it will render the old upnext, because the title haven't load yet, so it will return the old one
      if (!currenVideoTitle || currenVideoTitle.includes("loading")) return;
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has('list') || listId === 'LL' || listId === 'WL') return;

      const fetchUpNext = async () => {
        try {
          const cleanVideoTitle = currenVideoTitle.split('|')[0].split('-')[0].trim();
          const dataUpNext = await searchYouTube(cleanVideoTitle);
          setUpNextVideos(dataUpNext.items);
        } catch (error) {
          console.log("Error: ", error);
        };
      }
      fetchUpNext();
    }, [currenVideoTitle]);
  //

  /*(CURRENT VIDEO): HANDLE DES, SUB, SAVE, LIKE, COMMENT POST
    (UP NEXT): OPEN SAVE MODAL, SAVE, ADD TO LIST */ 
    const handleDescription = (text: string) => {
      if (!text) return null;
      // Regex indentify link YouTube (youtube.com and youtu.be)
      const youtubeRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s]+)/g;
      // Regex of other link
      const generalUrlRegex = /(https?:\/\/[^\s]+)/g;
      //Hash tage
      const hashtagRegex = /#(?!\d)[\p{L}\p{N}_]+/gu;
      //seperate string by space to check each element
      const words = text.split(/(\s+)/);
      return words.map((word, index) => {
        // Check whether youtube link
        if (word.match(youtubeRegex)) {
          return (
            <a
              key={index}
              href={word}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 my-1 bg-[#272727] hover:bg-[#3f3f3f] text-white text-xs font-medium rounded-full transition align-middle shadow-sm"
              onClick={(e) => e.stopPropagation()}
              title={word}
            >
              <img
                src="/public/logo.png"
                className="w[15px] h-[15px]"
              />
              <span className="text-gray-300">•</span>
              <span className="truncate max-w-[180px]">YouTube Video</span>
            </a>
          );
        }
        // if other link
        else if (word.match(generalUrlRegex)) {
          const displayUrl = word.length > 30 ? word.substring(0, 30) + '...' : word;
          return (
            <a
              key={index}
              href={word}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3ea6ff] hover:underline inline-block"
              onClick={(e) => e.stopPropagation()}
              title={word}
            >
              {displayUrl}
            </a>
          );
        } else if (word.match(hashtagRegex)) {
          const cleanWord = word.replace('#', '');
          return (
            <a
              key={index}
              href={`/search?q=${cleanWord}`} // Navigate to youtube hashtag
              className="text-[#3ea6ff] font-medium hover:inline-block"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {word}
            </a>
          );
        }
        return word;
      });
    };

    const handleSubscribeToggle = () => {
      const nextState = !isSubscribed;
      setIsSubscribed(nextState);
      // get the old subcription list from localStorage
      // convert string to array
      const savedSubs = JSON.parse(localStorage.getItem('subscribed_channels') || '[]');

      // Add this channel into this localstorage, this is hashmap(key, value)
      const currentChannel = {
        id: video?.snippet?.channelId || 'unknown_id',
        title: video?.snippet?.channelTitle || 'Channel Name',
        thumbnail: video1?.snippet?.thumbnails?.medium?.url || '', // avatar channel
      };

      if (nextState) {
        // if click subcribe (Subscribe): Add channel to array if it is not in array
        const exists = savedSubs.some((sub: any) => sub.id === currentChannel.id);
        if (!exists) {
          //add object(hashmap) into an array
          //we get the old subcription list and push this object to the end of array
          const updatedSubs = [...savedSubs, currentChannel];
          //localstorage only save string, so we have to convert array to string
          localStorage.setItem('subscribed_channels', JSON.stringify(updatedSubs));
        }
      } else {
        // IF WE UNSUBCRIBE (Unsubscribe): remove it from array
        const updatedSubs = savedSubs.filter((sub: any) => sub.id !== currentChannel.id);
        localStorage.setItem('subscribed_channels', JSON.stringify(updatedSubs));
      }
    };

    const handleSaveToggle = () => {
      if (!video || !video.id) return;
      const existingSavedVideos = JSON.parse(localStorage.getItem('saved_video') || '[]');
      const isAlreadySaved = existingSavedVideos.some((v: any) => v.id === video.id);
      let updatedSavedVideos;
      if (isAlreadySaved) {
        updatedSavedVideos = existingSavedVideos.filter((v: any) => v.id !== video.id);
        setIsSaved(false);
      } else {
        updatedSavedVideos = [video, ...existingSavedVideos];
        setIsSaved(true);
      }
      localStorage.setItem('saved_video', JSON.stringify(updatedSavedVideos));
    };

    const handleLikeToggle = () => {
      if (!video || !video.id) return;
      const existingLikedVideos = JSON.parse(localStorage.getItem('like_video') || '[]');
      const isAlreadyLiked = existingLikedVideos.some((v: any) => v.id === video.id);

      let updatedLikedVideos;
      if (isAlreadyLiked) {
        // Nếu đã like rồi -> Bấm lần nữa là UNLIKE (gỡ ra)
        updatedLikedVideos = existingLikedVideos.filter((v: any) => v.id !== video.id);
        setIsLiked(false); // Cập nhật lại state giao diện thành chưa like
      } else {
        // Nếu chưa like -> Thêm vào danh sách
        updatedLikedVideos = [video, ...existingLikedVideos];
        setIsLiked(true); // Cập nhật lại state giao diện thành đã like
      }
      // Lưu lại vào localStorage
      localStorage.setItem('like_video', JSON.stringify(updatedLikedVideos));
    };

    const handlePostComment = (e: React.FormEvent) => {
      e.preventDefault();
      if (!commentText.trim()) return;
      // Create a fake comment (the structure must be the same API)
      const newComment = {
        id: Date.now().toString(), // create a temporary ID 
        snippet: {
          topLevelComment: {
            snippet: {
              authorDisplayName: "Quang (You)",
              authorProfileImageUrl: "/public/Q.png", // Avatar
              textDisplay: commentText,
              publishedAt: new Date().toISOString(),
              likeCount: 0
            }
          }
        }
      };
      //Update state (add to the first array)
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

    const handleCopyURL = (id: string) => {
      console.log(`id video: ${id}`);
      const shareUrl = `https://youtube.com/watch?v=${id}`;
      try {
        navigator.clipboard.writeText(shareUrl);
        showNotice("Copy successfully");
      } catch (error) {
        console.warn("Copy failed ", error);
      }
    };
  //
  /* FOR UP NEXT */
    const removeVideoFromList = (id: string) => {
      const storageKey = listType ? 'saved_video' : 'like_video';

      const updated = playListVideo.filter(v => v.id !== id);
      setPlayListVideo(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      showNotice(`Removed from ${listType ? 'Watch Later' : 'Liked Videos'}`);
    };

    const handleSaveToggleUpNext = (videoUpNext: any) => {
      if (!videoUpNext) return;

      const cleanId = getVideoId(videoUpNext);
      if (!cleanId) return;

      // Chuẩn hóa cấu trúc object lưu trữ để trang Watch Later / Liked đọc đúng dữ liệu
      const normalizedVideo = {
        id: cleanId,
        snippet: {
          title: videoUpNext?.snippet?.title || 'No Title',
          channelTitle: videoUpNext?.snippet?.channelTitle || 'Unknown Channel',
          thumbnails: videoUpNext?.snippet?.thumbnails || {},
          //Title channel
        }
      };
      const existingSavedVideos = JSON.parse(localStorage.getItem('saved_video') || '[]');
      const isAlreadySaved = existingSavedVideos.some((v: any) => getVideoId(v) === cleanId);
      let updatedSavedVideos;
      if (isAlreadySaved) {
        updatedSavedVideos = existingSavedVideos.filter((v: any) => getVideoId(v) !== cleanId);
        setIsSavedUpNext(false);
      } else {
        updatedSavedVideos = [normalizedVideo, ...existingSavedVideos];
        setIsSavedUpNext(true);
      }
      localStorage.setItem('saved_video', JSON.stringify(updatedSavedVideos));
      setWatchLaterVideoList(updatedSavedVideos);
    };

    const handleOpenSaveModal = (videoUpNext: any) => {
      if (videoUpNext && videoUpNext.id) {
        const currentId = typeof videoUpNext.id === 'object' ? videoUpNext.id.videoId : videoUpNext.id;
        const savedVideos = JSON.parse(localStorage.getItem('saved_video') || '[]');
        const isSavedd = savedVideos.some((v: any) => {
          const vId = typeof v.id === 'object' ? v.id.videoId : v.id;
          return vId === currentId;
        });
        setIsSavedUpNext(isSavedd);
      }
    };

    const addVideoToList = (video: any) => {
      if (!video.id || !video) return;
      const existingListVideos = JSON.parse(localStorage.getItem('saved_video') || '[]');
      const isAlreadyInList = existingListVideos.some((v: any) => v.id === video.id);
      if (!isAlreadyInList) {
        const updateList = [video, ...existingListVideos];
        localStorage.setItem('saved_video', JSON.stringify(updateList));
      }
      showNotice("Saved to Watch Later");
    };
  //
  
  /* SHARE BUTTON */
    const shareToFacebook = (videoId: string) => {
      if (!video || !video.id) return;
      let youtubeUrl;
      if (videoId) {
        youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      } else {
        youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;
      }
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(youtubeUrl)}`;
      window.open(facebookShareUrl, '_blank');
    };

    const shareToX = (videoId: string, videoTitle: string) => {
      if (!video || !video.id) return;
      let youtubeUrl;
      let text;
      if (videoId) {
        youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        text = encodeURIComponent(videoTitle ? videoTitle.replace(/\s*\(playlist\)/gi, '').trim() : '');
      } else {
        youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;
        text = encodeURIComponent(video.snippet?.title ? `${video.snippet?.title.replace(/\s*\(playlist\)/gi, '').trim()}` : '');
      }
      // "replace(/\s*\(playlist\)/gi, '').trim()" delete (playlist) 
      const xShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(youtubeUrl)}&text=${text}`;
      window.open(xShareUrl, '_blank');
    }

    const shareToLinkedin = (videoId: string) => {
      if (!video || !video.id) return;
      let youtubeUrl;
      if (videoId) {
        youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      } else {
        youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;
      }
      const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(youtubeUrl)}`;
      window.open(linkedinShareUrl, '_blank');
    }

    const shareToReddit = (videoId: string, videoTitle: string) => {
      if (!video || !video.id) return;
      let youtubeUrl;
      let text;
      if (videoId) {
        youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        text = encodeURIComponent(videoTitle ? videoTitle.replace(/\s*\(playlist\)/gi, '').trim() : '');
      } else {
        youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;
        // "replace(/\s*\(playlist\)/gi, '').trim()" delete (playlist) 
        text = encodeURIComponent(video.snippet?.title ? `${video.snippet?.title.replace(/\s*\(playlist\)/gi, '').trim()}` : '');
      }
      const redditShareUrl = `https://reddit.com/submit?url=${encodeURIComponent(youtubeUrl)}&title=${text}`;
      window.open(redditShareUrl, '_blank');
    }
  //

  /*SET STATE FOR CURRENT VIDEO AND UP NEXT */
    useEffect(() => {
      const savedWatchLaterVideo = JSON.parse(localStorage.getItem('saved_video') || '[]');
      setWatchLaterVideoList(savedWatchLaterVideo);
    }, []);

    /* History video */
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

    useEffect(() => {
      if (video && video.id) {
        const saveSavedVideos = JSON.parse(localStorage.getItem('saved_video') || '[]');
        const isSaved = saveSavedVideos.some((v: any) => v.id === video.id);
        setIsSaved(isSaved);
      }
    }, [video]);

    /* Like, check is it liked or not */
    useEffect(() => {
      if (video && video.id) {
        const saveLikedVideos = JSON.parse(localStorage.getItem('like_video') || '[]');
        const isLiked = saveLikedVideos.some((v: any) => v.id === video.id);
        setIsLiked(isLiked);
      }
    }, [video]);

    /* Subcribe, check is it subcribed or not */
    useEffect(() => {
      if (video && video.snippet?.channelId) {
        const savedSubs = JSON.parse(localStorage.getItem('subscribed_channels') || '[]');
        const isSubbed = savedSubs.some((sub: any) => sub.id === video.snippet.channelId);
        setIsSubscribed(isSubbed);
      }
    }, [video]);
  //

  /* MAKE DATA FORM BETTER: GET */
    const getVideoId = (video: any) => {
      if (!video) return '';
      if (typeof video.id === 'object' && video.id !== null) {
        return video.id.videoId || video.id;
      }
      return video.id;
    };

    const getHashtags = (text: string) => {
      if (!text) return [];
      const hashtagRegex = /#(?!\d)\w+/g;
      const matches = text.match(hashtagRegex) || [];
      const tags = matches.slice(0, 3);
      // \u00A0\u00A0\u00A0: space
      return tags.join(' ');
    };

    const getSubcriber = (subcriber: string) => {
      const totalSubcriber: number = Number(subcriber);
      if (totalSubcriber < 1000) {
        return `${totalSubcriber}`;
      }
      if (totalSubcriber < 1000000) {
        const subcribers: number = totalSubcriber / 1000;
        return `${subcribers}K`;
      }
      if (totalSubcriber < 1000000000) {
        const subcribers: number = totalSubcriber / 1000000;
        return `${subcribers}M`;
      }
    }

    const getTimeago = (date: string) => {
      const videoDate = new Date(date);
      const currentTime = new Date();
      const timeAgo = Math.floor((currentTime.getTime() - videoDate.getTime()) / 1000);

      if (timeAgo < 60) return `${timeAgo} seconds ago`; //SECOND
      if (timeAgo < 3600) { // MINUTE
        const minutes = Math.floor(timeAgo / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      }
      if (timeAgo < 86400) { // HOUR
        const hours = Math.floor(timeAgo / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      }
      if (timeAgo < 604800) { // DAY
        const days = Math.floor(timeAgo / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
      }
      if (timeAgo < 2592000) { // WEEK
        const weeks = Math.floor(timeAgo / 604800);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
      }
      if (timeAgo < 31536000) { // MONTH
        const months = Math.floor(timeAgo / 2592000);
        return `${months} month${months > 1 ? 's' : ''} ago`;
      }
      //YEAR
      const years = Math.floor(timeAgo / 31536000);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }

    const getView = (view: string) => {
      const totalView: number = Number(view);
      if (totalView < 1000) {
        return `${view} views`
      }
      if (totalView < 1000000) { // < 1M view 
        const views: number = Math.floor(totalView / 1000);
        return `${views}K views`;
      }
      if (totalView < 1000000000) {
        const views: number = Math.floor(totalView / 1000000);
        return `${views}M views`;
      }
      if (totalView < 1000000000000) {
        const views: number = Math.floor(totalView / 1000000000);
        return `${views}B views`;
      }
    }

    const getTimeDescription = (date: string) => {
      const videoDate = new Date(date);
      const dayandmonth: string = videoDate.toDateString().slice(4, 10);
      const year: string = videoDate.toDateString().slice(11, 16);
      return `${dayandmonth}, ${year}`;
    }

    const getLike = (like: string) => {
      const totalLike: number = Number(like);
      if (totalLike < 1000) {
        return `${like}`
      }
      if (totalLike < 1000000) { // < 1M view 
        const likes: number = Math.floor(totalLike / 1000);
        return `${likes}K`;
      }
      if (totalLike < 1000000000) {
        const likes: number = Math.floor(totalLike / 1000000);
        return `${likes}M`;
      }
      if (totalLike < 1000000000000) {
        const likes: number = Math.floor(totalLike / 1000000000);
        return `${likes}B`;
      }
    }
  //

  return (
    <div className="w-full mx-auto py-0 flex flex-col lg:flex-row gap-5 text-[#f1f1f1]">

      {/* LEFT COLUMN (Video Player + Description + Comments) */}
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

        {/* Action & Channel details row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-3 pb-4 border-b border-[#2d2d2d]">
          {/* Channel avatar & subscribers & subscribe trigger */}
          <div className="flex items-center gap-3">
            <img
              src={video1?.snippet?.thumbnails.medium?.url || "..Loading.."}
              className="w-10 h-10 rounded-full object-cover border border-[#303030]"
            />
            <div className="flex flex-col">
              <span onClick={goChannel} className="font-sans font-semibold text-sm hover:text-white cursor-pointer">{video?.snippet?.channelTitle || "Loading..."}</span>
              <span className="text-xs text-gray-400">{getSubcriber(video1?.statistics?.subscriberCount)} subscribers</span>
            </div>

            <button
              onClick={handleSubscribeToggle}
              className={`gap-1 px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition active:scale-95 ${isSubscribed
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
                onClick={handleLikeToggle}
                className={`flex items-center gap-1.5 px-4 py-2 hover:bg-[#303030] rounded-l-full border-r border-[#303030] transition text-xs font-semibold cursor-pointer
                ${isLiked ? 'text-[#ff0000]' : 'text-[#f1f1f1]'
                  }`}
              >
                {getLike(video?.statistics?.likeCount)} likes
              </button>
              {/* dislike button */}
              {/* Pay attention to hover */}
              <button
                onClick={() => setDisIsLiked(!isdisLiked)}
                className={`px-4 py-2 hover:bg-[#303030] rounded-r-full text-[#f1f1f1] transition text-xs font-semibold cursor-pointer
              ${isdisLiked ? 'text-[#ff0000]' : 'text-[#f1f1f1]'
                  }`}
              >
                dislike
              </button>

            </div>

            {/* Save (Watch Later) */}
            <button
              onClick={handleSaveToggle}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#303030]/50 transition text-xs font-semibold shrink-0 cursor-pointer 
                ${isSaved
                  ? 'bg-emerald-950/40 hover:bg-emerald-900/40 text-green-400 border-emerald-800/80'
                  : 'bg-[#212121] hover:bg-[#303030]'}
                `}
            >
              {isSaved ? 'Saved' : 'Watch Later'}
            </button>

            {/* SHARE */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsShareModal(true);
              }}
              className="flex items-center px-4 py-2 bg-[#212121] hover:bg-[#303030] border border-[#303030]/50 rounded-full transition text-xs font-semibold shrink-0 cursor-pointer"
            >
              <img
                alt="Share"
                src="/public/share.png" className="h-4 w-4 mr-2"
              />
              Share
            </button>
            {isShareModal && (
              <div
                onClick={() => setIsShareModal(false)}
                className="fixed inset-0 z-50 flex items-center justify-center cursor-default bg-black/50"
              >
                {/* Khung chứa nội dung bảng (Màu nền tối giống YouTube, có bo góc và cuộn khi dài) */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#212121] text-white w-[400px] max-h-[80vh] overflow-y-auto rounded-2xl p-6 shadow-2xl relative [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#555] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                  {/* Nút Đóng (Dấu X góc trên bên phải) */}
                  <button
                    onClick={() => setIsShareModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl w-10 h-10 rounded-full cursor-pointer"
                  >
                    ✕
                  </button>
                  <h2 className="text-xl font-bold mb-6 flex items-center justify-center">
                    Share
                  </h2>
                  <div className="flex flex-row gap-3">
                    <button
                      className="flex flex-col cursor-pointer"
                      onClick={() => shareToFacebook("")}
                    >
                      <img
                        alt="Share"
                        src="/public/facebook.png"
                        className="rounded-full object-cover h-15 w-15 mb-2 cursor-pointer"
                      />
                      Facebook
                    </button>
                    <button
                      className="flex flex-col cursor-pointer"
                      onClick={() => shareToX("", "")}
                    >
                      <img
                        src="/public/X.png"
                        className="rounded-full object-cover h-17 w-18 cursor-pointer"
                      />
                      X
                    </button>

                    <button
                      className="flex flex-col cursor-pointer -ml-2"
                      onClick={() => shareToLinkedin("")}
                    >
                      <img
                        src="/public/linkedin.png"
                        className="rounded-full object-cover h-17 w-18 cursor-pointer"
                      />
                      Linked
                    </button>

                    <button
                      className="flex flex-col cursor-pointer"
                      onClick={() => shareToReddit("", "")}
                    >
                      <img
                        src="/public/reddit.png"
                        className="rounded-full object-cover mb-2 h-15 w-15 cursor-pointer"
                      />
                      Reddit
                    </button>
                  </div>
                  <div className="flex items-center bg-[#1f1f1f] border border-neutral-700 rounded-xl p-2 max-w-md mt-5">
                    {/* <div className="mt-10 bg-black h-15 rounded-[10px] overflow-x-auto whitespace-nowrap w-full text-white"> */}
                    <input
                      type="text"
                      readOnly
                      value={`https://youtube.com/watch?v=${video.id}`}
                      onClick={(e) => e.currentTarget.select()}
                      className="w-full bg-transparent text-white text-sm px-3 outline-none cursor-text select-all truncate selection:bg-blue-600"
                    />

                    <button
                      onClick={() => {
                        handleCopyURL(video.id);
                      }}
                      className="bg-white hover:bg-neutral-200 text-black font-medium px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap ml-2 cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => window.open(`https://youtube.com/watch?v=${videoId}`, '_blank')}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#212121] hover:bg-[#303030] border border-[#303030]/50 rounded-full transition text-xs font-semibold shrink-0 cursor-pointer"
            >
              Youtube
            </button>
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
                <span>{video?.statistics?.viewCount} views</span>
                <span>{getTimeDescription(video?.snippet?.publishedAt)}</span>
                <span className="text-[#3ea6ff]">{getHashtags(video?.snippet?.description)}</span>
              </>
            ) : (
              <>
                <span>{getView(video?.statistics?.viewCount)}</span>
                <span>{getTimeago(video?.snippet?.publishedAt)}</span>
                <span className="text-gray-400">{getHashtags(video?.snippet?.description)}</span>
              </>
            )}
          </div>

          {/* DESCRIPTION */}
          {/* line-clamp2 and whitespace-pre-wrap, process data received from YOUTUBE API */}
          <div className={`font-sans text-gray-300 break-words ${!isExpandedDecription ? 'line-clamp-1' : 'whitespace-pre-wrap'}`}>
            {video?.snippet?.description ?
              (handleDescription(video.snippet.description))
              :
              (<div className="italic">No description has been added to this video</div>)}
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
                      type="button"
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
                  <p
                    dangerouslySetInnerHTML={{ __html: comment.textDisplay }}
                    className="text-sm mt-1 text-gray-200"
                  />
                  {/* {comment.textDisplay}</p> */}
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

      {/* RIGHT COLUMN (SIDEBAR FEED), UP NEXT */}
      <div className="lg:w-[380px] shrink-0 flex flex-col gap-3 -mr-3">
        {listId === 'LL' || listId === 'WL' ?
          ""
          :
          <h3 className="font-sans font-semibold text-sm text-gray-400 mb-1 px-1">Up Next</h3>
        }
        {listId === 'LL' || listId === 'WL' ? (
          <div className="flex flex-col gap-3 rounded-xl border border-gray-700 mr-3">
            {/* Header of Playlist */}
            <div className="bg-[#212121] p-3 rounded-xl border border-[#303030]">
              <h3 className="font-sans font-bold text-xl text-white">{listType ? 'Watch Later' : 'Liked videos'}</h3>
              <p className="text-xs text-gray-400 mt-0.5">Private • Playlist • {playListVideo.length} videos</p>
            </div>

            {/* List video in playlist */}
            {playListVideo.map((item, index) => (
              <div
                key={item.id}
                onClick={() => navigate(`/watch?v=${item.id}&list=${listId}&index=${index + 1}`)}
                className={`flex gap-3 group cursor-pointer p-1.5 -mb-2 transition ${item.id === videoId ? 'bg-gray-700' : 'hover:bg-[#1c1c1c]'
                  }`}
              >
                <span className="text-xs text-gray-400 flex items-center justify-center shrink-0 font-medium">
                  {index + 1}
                </span>

                <div className="relative w-[90px] h-[55px] flex items-center aspect-video rounded-md overflow-hidden shrink-0 bg-[#212121]">
                  <img
                    src={item?.snippet?.thumbnails?.medium?.url || item?.snippet?.thumbnails?.default?.url}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-1 py-0.5">
                  <h4 className="text-xs font-semibold leading-snug line-clamp-3 text-[#f1f1f1] group-hover:text-white">
                    {item?.snippet?.title?.length > 45
                      ? item.snippet.title.slice(0, 45) + '...'
                      : item?.snippet?.title}
                  </h4>
                  <span className="text-[12px] text-gray-400 truncate">
                    {item?.snippet?.channelTitle}
                  </span>

                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const vidId = item.id;
                    setActiveMenuId(activeMenuId === vidId ? null : vidId);
                  }}
                  className="hidden text-xl group-hover:block cursor-pointer top-20 w-[30px] h-[30px] hover:text-white"
                >
                  ⋮
                </button>
                {activeMenuId === item.id && (
                  <>
                    <div
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(null);
                      }}
                    />

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="overflow-hidden absolute right-10 mt-[55px] w-[250px] bg-[#282828]  overflow-hidden text-white rounded-xl shadow-2xl py-2 z-50 text-sm border-neutral-700"
                    >
                      <div className="pb-2 border-b border-gray-500">
                        {!listType && (
                          <>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                addVideoToList(item);
                              }}
                              className="w-full px-4 py-2 flex items-center -mt-2 cursor-pointer hover:bg-neutral-700 transition-colors text-left rounded-t-xl">
                              <img
                                alt="Save to Watch Later"
                                src="/public/savetowatchlater.png" className="h-6 w-6 mr-3"
                              />
                              Save to Watch later
                            </button>

                          </>)}


                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsShareModalUpNext(true);
                          }}
                          className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left">
                          <img
                            alt="Share"
                            src="/public/share.png" className="h-5 w-5 mr-3"
                          />
                          Share
                        </button>
                        {isShareModalUpNext && (
                          <div
                            onClick={() => setIsShareModalUpNext(false)}
                            className="fixed inset-0 z-50 flex items-center justify-center cursor-default bg-black/50"
                          >
                            {/* Khung chứa nội dung bảng (Màu nền tối giống YouTube, có bo góc và cuộn khi dài) */}
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="bg-[#212121] text-white w-[400px] max-h-[80vh] overflow-y-auto rounded-2xl p-6 shadow-2xl relative [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#555] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                              {/* Nút Đóng (Dấu X góc trên bên phải) */}
                              <button
                                onClick={() => setIsShareModalUpNext(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl w-10 h-10 rounded-full cursor-pointer"
                              >
                                ✕
                              </button>
                              <h2 className="text-xl font-bold mb-6 flex items-center justify-center">
                                Share
                              </h2>
                              <div className="flex flex-row gap-3">
                                <button
                                  className="flex flex-col cursor-pointer"
                                  onClick={() => {
                                    const videoId = video.id.videoId || "";
                                    shareToFacebook(videoId);
                                  }}
                                >
                                  <img
                                    alt="Share"
                                    src="/public/facebook.png"
                                    className="rounded-full object-cover h-15 w-15 mb-2 cursor-pointer"
                                  />
                                  Facebook
                                </button>
                                <button
                                  className="flex flex-col cursor-pointer"
                                  onClick={() => {
                                    shareToX(item.id, item.snippet.title);
                                  }}
                                >
                                  <img
                                    src="/public/X.png"
                                    className="rounded-full object-cover h-17 w-18 cursor-pointer"
                                  />
                                  X
                                </button>

                                <button
                                  className="flex flex-col cursor-pointer -ml-2"
                                  onClick={() => {
                                    shareToLinkedin(item.id);
                                  }}
                                >
                                  <img
                                    src="/public/linkedin.png"
                                    className="rounded-full object-cover h-17 w-18 cursor-pointer"
                                  />
                                  Linked
                                </button>

                                <button
                                  className="flex flex-col cursor-pointer"
                                  onClick={() => {
                                    shareToReddit(item.id, item.snippet.title);
                                  }}
                                >
                                  <img
                                    src="/public/reddit.png"
                                    className="rounded-full object-cover mb-2 h-15 w-15 cursor-pointer"
                                  />
                                  Reddit
                                </button>
                              </div>
                              <div className="flex items-center bg-[#1f1f1f] border border-neutral-700 rounded-xl p-2 max-w-md mt-5">
                                {/* <div className="mt-10 bg-black h-15 rounded-[10px] overflow-x-auto whitespace-nowrap w-full text-white"> */}
                                <input
                                  type="text"
                                  readOnly
                                  value={`https://youtube.com/watch?v=${item.id}`}
                                  onClick={(e) => e.currentTarget.select()}
                                  className="w-full bg-transparent text-white text-sm px-3 outline-none cursor-text select-all truncate selection:bg-blue-600"
                                />

                                <button
                                  onClick={() => {
                                    handleCopyURL(item.id);
                                  }}
                                  className="bg-white hover:bg-neutral-200 text-black font-medium px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap ml-2 cursor-pointer"
                                >
                                  Copy
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeVideoFromList(item.id);
                        }}
                        className="mt-1 w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left"
                      >
                        <img
                          alt="Add to queue"
                          src="/public/bin.png" className="h-5 w-5 mr-3 pointer-events-none"
                        />
                        Remove from {listType ? 'Watch later' : 'Liked videos'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            <div className="text-s text-gray-400 mt-0.5 flex items-center justify-center">
              {listType ? 'Xem video da luu free, ko quang cao' : 'Nghe nhac free, ko quang cao !'}
            </div>
          </div>
        ) : (
          <>
            {upNextVideos.map((video) => (
              <div
                key={video.id.videoId}
                onClick={() => {
                  if (video.id.videoId) {
                    goWatch(video.id.videoId);
                  }
                }}
                className="flex gap-3 group w-full cursor-pointer hover:bg-gray-900 relative"
              >
                {/* Mini Thumbnail */}
                <div className="relative w-[200px] aspect-video rounded-lg overflow-hidden shrink-0 bg-[#212121]">
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
                  <h4 className="text-sm font-semibold leading-snug line-clamp-3 w-full text-[#f1f1f1] group-hover:text-white transition-colors">
                    {video?.snippet?.title || "Loading"}
                  </h4>
                  <div className="flex flex-col gap-0.5 font-medium text-gray-400">
                    <span className="truncate text-[12px]">{video?.snippet?.channelTitle || "Loading"}</span>
                    <div className="flex items-center truncate">
                      {/* <span>views</span> */}
                      {/* <span className="mx-1 text-[6px]">•</span> */}
                      <span className="text-[12px]">{getTimeago(video?.snippet?.publishedAt)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const vidId = video.id?.videoId ?? null;
                    setActiveMenuId(activeMenuId === vidId ? null : vidId);
                  }}
                  className="hidden text-l group-hover:block absolute right-1 cursor-pointer top-20 w-[30px] h-[30px] hover:bg-[#383838] rounded-full text-white shadow-md transition"
                >
                  ⋮
                </button>
                {activeMenuId === video.id.videoId && (
                  <>
                    <div
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(null);
                      }}
                    />

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="overflow-hidden absolute right-0 mt-[110px] w-[200px] bg-[#282828] overflow-hidden text-white rounded-xl shadow-2xl py-2 z-50 text-sm border-neutral-700"
                    >
                      <button
                        className="w-full px-4 py-2 flex items-center -mt-2 cursor-pointer hover:bg-neutral-700 transition-colors text-left rounded-t-xl">
                        <img
                          alt="Add to queue"
                          src="/public/addtoqueue.png" className="h-6 w-6 mr-3"
                        />
                        Add to queue
                      </button>
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          addVideoToList(video);
                        }}
                        className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left">
                        <img
                          alt="Save to watch later"
                          src="/public/savetowatchlater.png" className="h-6 w-6 mr-3"
                        />
                        Save to watch later
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(null);
                          setSelectedVideo(video);
                          handleOpenSaveModal(video);
                        }}
                        className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left">
                        <img
                          alt="Save to playlist"
                          src="/public/savetoplaylist.png" className="h-6 w-5 mr-3"
                        />
                        Save to playlist
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsShareModalUpNext(true);
                        }}
                        className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left">
                        <img
                          alt="Share"
                          src="/public/share.png" className="h-5 w-5 mr-3"
                        />
                        Share
                      </button>
                      {isShareModalUpNext && (
                        <div
                          onClick={() => setIsShareModalUpNext(false)}
                          className="fixed inset-0 z-50 flex items-center justify-center cursor-default bg-black/50"
                        >
                          {/* Khung chứa nội dung bảng (Màu nền tối giống YouTube, có bo góc và cuộn khi dài) */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#212121] text-white w-[400px] max-h-[80vh] overflow-y-auto rounded-2xl p-6 shadow-2xl relative [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#555] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                            {/* Nút Đóng (Dấu X góc trên bên phải) */}
                            <button
                              onClick={() => setIsShareModalUpNext(false)}
                              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl w-10 h-10 rounded-full cursor-pointer"
                            >
                              ✕
                            </button>
                            <h2 className="text-xl font-bold mb-6 flex items-center justify-center">
                              Share
                            </h2>
                            <div className="flex flex-row gap-3">
                              <button
                                className="flex flex-col cursor-pointer"
                                onClick={() => {
                                  const videoId = video.id.videoId || "";
                                  shareToFacebook(videoId);
                                }}
                              >
                                <img
                                  alt="Share"
                                  src="/public/facebook.png"
                                  className="rounded-full object-cover h-15 w-15 mb-2 cursor-pointer"
                                />
                                Facebook
                              </button>
                              <button
                                className="flex flex-col cursor-pointer"
                                onClick={() => {
                                  const videoId = video.id.videoId || "";
                                  const title = video.snippet.title || "";
                                  shareToX(videoId, title);
                                }}
                              >
                                <img
                                  src="/public/X.png"
                                  className="rounded-full object-cover h-17 w-18 cursor-pointer"
                                />
                                X
                              </button>

                              <button
                                className="flex flex-col cursor-pointer -ml-2"
                                onClick={() => {
                                  const videoId = video.id.videoId || "";
                                  shareToLinkedin(videoId);
                                }}
                              >
                                <img
                                  src="/public/linkedin.png"
                                  className="rounded-full object-cover h-17 w-18 cursor-pointer"
                                />
                                Linked
                              </button>

                              <button
                                className="flex flex-col cursor-pointer"
                                onClick={() => {
                                  const videoId = video.id.videoId || "";
                                  const title = video.snippet.title || "";
                                  shareToReddit(videoId, title);
                                }}
                              >
                                <img
                                  src="/public/reddit.png"
                                  className="rounded-full object-cover mb-2 h-15 w-15 cursor-pointer"
                                />
                                Reddit
                              </button>
                            </div>
                            <div className="flex items-center bg-[#1f1f1f] border border-neutral-700 rounded-xl p-2 max-w-md mt-5">
                              {/* <div className="mt-10 bg-black h-15 rounded-[10px] overflow-x-auto whitespace-nowrap w-full text-white"> */}
                              <input
                                type="text"
                                readOnly
                                value={`https://youtube.com/watch?v=${video.id.videoId}`}
                                onClick={(e) => e.currentTarget.select()}
                                className="w-full bg-transparent text-white text-sm px-3 outline-none cursor-text select-all truncate selection:bg-blue-600"
                              />

                              <button
                                onClick={() => {
                                  const videoId = video.id.videoId;
                                  handleCopyURL(videoId);
                                }}
                                className="bg-white hover:bg-neutral-200 text-black font-medium px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap ml-2 cursor-pointer"
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </> /* Menu of up next video */
                )}
                {selectedVideo === video && (
                  <>
                    <div
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVideo(null);
                      }}
                    />
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="overflow-hidden absolute right-0 mt-12 w-[400px] cursor-default bg-[#282828] text-white rounded-xl shadow-2xl py-2 z-50 text-sm"
                    >
                      <div className="px-4 py-2 text-[17px] font-bold mb-6">Save to...</div>

                      {/* Phần danh sách Watch Later / Playlist của bạn */}
                      <div className="w-full px-5 py-2 flex items-center -mt-4 cursor-pointer hover:bg-neutral-700 transition-colors text-left">
                        <div onClick={() => handleSaveToggleUpNext(video)} className="relative group">
                          {watchLaterVideoList.length > 0 ? (
                            <>
                              <div className="flex flex-row">
                                <div className="relative w-28 h-8 flex-shrink-0">
                                  {/* Layer behind watch list */}
                                  <div className="absolute -top-1 left-3 right-2 h-8 w-[55px] bg-[#737373] rounded-md"></div>

                                  <img
                                    src={watchLaterVideoList[0]?.snippet?.thumbnails?.medium?.url}
                                    className="h-[35px] w-[65px] absolute ml-2 inset-0 rounded-md overflow-hidden border border-black/40 flex items-center justify-center"
                                  />
                                </div>

                                <div className="flex flex-col -ml-6 -mt-1">
                                  <span className="text-sm font-medium">Watch later</span>
                                  <span className="text-xs text-neutral-400">Private</span>
                                </div>
                                <div className="ml-[170px] text-neutral-300">
                                  {isSavedUpNext ?
                                    <>
                                      <img
                                        src="/public/savedVideo.png" className="h-6 w-5"
                                      />
                                    </>
                                    :
                                    <>
                                      <img
                                        src="/public/savetoplaylist.png" className="h-6 w-5"
                                      />
                                    </>
                                  }
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex flex-row">
                                <div className="relative w-28 h-8 flex-shrink-0">
                                  <div className="absolute -top-2 left-3 right-2 h-8 w-[55px] bg-[#737373] rounded-md"></div>
                                  <img
                                    src="/loading1.png"
                                    className="h-[35px] w-[65px] absolute ml-2 inset-0 rounded-md overflow-hidden border border-black/40 flex items-center justify-center"
                                  />
                                </div>


                                <div className="flex flex-col -ml-6 -mt-1">
                                  <span className="text-sm font-medium">Watch later</span>
                                  <span className="text-xs text-neutral-400">Private</span>
                                </div>
                                <div className="ml-[170px] text-neutral-300">
                                  {isSavedUpNext ?
                                    <>
                                      <img
                                        src="/public/saved.png" className="h-6 w-5"
                                      />
                                    </>
                                    :
                                    <>
                                      <img
                                        src="/public/savetoplaylist.png" className="h-6 w-5"
                                      />
                                    </>
                                  }

                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))} {/* Up next video, RIGHT COLUMN*/}
          </>
        )}
        {noticeMessage && (
          <div className="fixed bottom-6 z-[100] left-1/2 -translate-x-1/2 px-4 py-2 bg-white border border-neutral-700 text-black text-sm font-semibold rounded-xl shadow-2xl transition-all animate-fade-in flex items-center gap-2">
            <span>{noticeMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}