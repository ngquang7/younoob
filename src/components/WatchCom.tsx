import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { searchYouTube } from '../api/youtubeSearch';
import { getVideosDetails } from "../api/videoWatchingData";
import { getChannelData } from '../api/channelData';
import { getCommentData } from '../api/commentData';
import type { YouTubeSearchItem } from "../type";

import ShareModal from './ShareModal';
import DescriptionBox from './DescriptionBox';
import CommentSection from './CommentSection';
import UpNext from './UpNext';

export default function WatchComponent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');
  const listId = searchParams.get('list');
  const listType = searchParams.get('list') === 'WL';

  const [video, setVideo] = useState<any>(null);
  const [video1, setVideo1] = useState<any>(null);
  const [playListVideo, setPlayListVideo] = useState<any[]>([]);
  const [upNextVideos, setUpNextVideos] = useState<YouTubeSearchItem[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [watchLaterVideoList, setWatchLaterVideoList] = useState<any[]>([]);
  const [, setLoading] = useState<boolean>(false);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isdisLiked, setDisIsLiked] = useState(false);
  const [isExpandedDecription, setisExpandedDecription] = useState(false);
  const [isAddComment, setIsAddComment] = useState(false);
  const [isShareModal, setIsShareModal] = useState(false);

  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const currenVideoTitle = video?.snippet?.title || "loading...";
  const channelId = video?.snippet?.channelId || "loading...";

  const goChannel = () => navigate(`/channel/${channelId}`);
  const goWatch = (videoidd: string) => {
    navigate(`/watch?v=${videoidd}`);
  };
  const showNotice = (message: string) => {
    setNoticeMessage(message);
    setTimeout(() => {
      setNoticeMessage(null);
    }, 2300);
  };

  useEffect(() => {
    if (!videoId) return;
    const fetchVideo = async () => {
      setLoading(true);
      try {
        const response = await getVideosDetails(videoId);
        if (response.items && response.items.length > 0) {
          const videoItem = response.items[0];
          setVideo(response.items[0]);

          const idChannel = videoItem.snippet?.channelId;
          const response1 = await getChannelData(idChannel);
          if (response1.items && response1.items.length > 0) {
            const channelItem = response1.items[0];
            setVideo1(channelItem);
          }
        }
        const commentResponse = await getCommentData(videoId);
        if (commentResponse.items) {
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
  }, [listId]);

  useEffect(() => {
    if (!currenVideoTitle || currenVideoTitle.includes("loading")) return;
    const currentParams = new URLSearchParams(window.location.search);
    if (currentParams.has('list') || listId === 'LL' || listId === 'WL') return;

    const fetchUpNext = async () => {
      try {
        const cleanVideoTitle = currenVideoTitle.split('|')[0].split('-')[0].trim();
        const dataUpNext = await searchYouTube(cleanVideoTitle);
        setUpNextVideos(dataUpNext.items);
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    fetchUpNext();
  }, [currenVideoTitle, listId]);

  const handleDescription = (text: string) => {
    if (!text) return null;
    const youtubeRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s]+)/g;
    const generalUrlRegex = /(https?:\/\/[^\s]+)/g;
    const hashtagRegex = /#(?!\d)[\p{L}\p{N}_]+/gu;
    const words = text.split(/(\s+)/);
    return words.map((word, index) => {
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
            <img src="/public/logo.png" className="w-[15px] h-[15px]" />
            <span className="text-gray-300">•</span>
            <span className="truncate max-w-[180px]">YouTube Video</span>
          </a>
        );
      } else if (word.match(generalUrlRegex)) {
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
            href={`/search?q=${cleanWord}`}
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
    const savedSubs = JSON.parse(localStorage.getItem('subscribed_channels') || '[]');
    const currentChannel = {
      id: video?.snippet?.channelId || 'unknown_id',
      title: video?.snippet?.channelTitle || 'Channel Name',
      thumbnail: video1?.snippet?.thumbnails?.medium?.url || '',
    };

    if (nextState) {
      const exists = savedSubs.some((sub: any) => sub.id === currentChannel.id);
      if (!exists) {
        const updatedSubs = [...savedSubs, currentChannel];
        localStorage.setItem('subscribed_channels', JSON.stringify(updatedSubs));
      }
    } else {
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
      updatedLikedVideos = existingLikedVideos.filter((v: any) => v.id !== video.id);
      setIsLiked(false);
    } else {
      updatedLikedVideos = [video, ...existingLikedVideos];
      setIsLiked(true);
    }
    localStorage.setItem('like_video', JSON.stringify(updatedLikedVideos));
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      snippet: {
        topLevelComment: {
          snippet: {
            authorDisplayName: "Quang (You)",
            authorProfileImageUrl: "/public/Q.png",
            textDisplay: commentText,
            publishedAt: new Date().toISOString(),
            likeCount: 0
          }
        }
      }
    };
    setComments([newComment, ...comments]);
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
    setCommentText("");
    setIsAddComment(false);
  };

  const handleCopyURL = (id: string) => {
    const shareUrl = `https://youtube.com/watch?v=${id}`;
    try {
      navigator.clipboard.writeText(shareUrl);
      showNotice("Copy successfully");
    } catch (error) {
      console.warn("Copy failed ", error);
    }
  };

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

    const normalizedVideo = {
      id: cleanId,
      snippet: {
        title: videoUpNext?.snippet?.title || 'No Title',
        channelTitle: videoUpNext?.snippet?.channelTitle || 'Unknown Channel',
        thumbnails: videoUpNext?.snippet?.thumbnails || {},
      }
    };
    const existingSavedVideos = JSON.parse(localStorage.getItem('saved_video') || '[]');
    const isAlreadySaved = existingSavedVideos.some((v: any) => getVideoId(v) === cleanId);
    let updatedSavedVideos;
    if (isAlreadySaved) {
      updatedSavedVideos = existingSavedVideos.filter((v: any) => getVideoId(v) !== cleanId);
    } else {
      updatedSavedVideos = [normalizedVideo, ...existingSavedVideos];
    }
    localStorage.setItem('saved_video', JSON.stringify(updatedSavedVideos));
    setWatchLaterVideoList(updatedSavedVideos);
  };

  const addVideoToList = (videoItem: any) => {
    if (!videoItem.id || !videoItem) return;
    const existingListVideos = JSON.parse(localStorage.getItem('saved_video') || '[]');
    const isAlreadyInList = existingListVideos.some((v: any) => v.id === videoItem.id);
    if (!isAlreadyInList) {
      const updateList = [videoItem, ...existingListVideos];
      localStorage.setItem('saved_video', JSON.stringify(updateList));
    }
    showNotice("Saved to Watch Later");
  };

  const shareToFacebook = (targetVideoId: string) => {
    const youtubeUrl = targetVideoId ? `https://www.youtube.com/watch?v=${targetVideoId}` : `https://www.youtube.com/watch?v=${video?.id}`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(youtubeUrl)}`;
    window.open(facebookShareUrl, '_blank');
  };

  const shareToX = (targetVideoId: string, videoTitle: string) => {
    const youtubeUrl = targetVideoId ? `https://www.youtube.com/watch?v=${targetVideoId}` : `https://www.youtube.com/watch?v=${video?.id}`;
    const text = encodeURIComponent(videoTitle ? videoTitle.replace(/\s*\(playlist\)/gi, '').trim() : (video?.snippet?.title ? video.snippet.title.replace(/\s*\(playlist\)/gi, '').trim() : ''));
    const xShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(youtubeUrl)}&text=${text}`;
    window.open(xShareUrl, '_blank');
  };

  const shareToLinkedin = (targetVideoId: string) => {
    const youtubeUrl = targetVideoId ? `https://www.youtube.com/watch?v=${targetVideoId}` : `https://www.youtube.com/watch?v=${video?.id}`;
    const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(youtubeUrl)}`;
    window.open(linkedinShareUrl, '_blank');
  };

  const shareToReddit = (targetVideoId: string, videoTitle: string) => {
    const youtubeUrl = targetVideoId ? `https://www.youtube.com/watch?v=${targetVideoId}` : `https://www.youtube.com/watch?v=${video?.id}`;
    const text = encodeURIComponent(videoTitle ? videoTitle.replace(/\s*\(playlist\)/gi, '').trim() : (video?.snippet?.title ? video.snippet.title.replace(/\s*\(playlist\)/gi, '').trim() : ''));
    const redditShareUrl = `https://reddit.com/submit?url=${encodeURIComponent(youtubeUrl)}&title=${text}`;
    window.open(redditShareUrl, '_blank');
  };

  useEffect(() => {
    const savedWatchLaterVideo = JSON.parse(localStorage.getItem('saved_video') || '[]');
    setWatchLaterVideoList(savedWatchLaterVideo);
  }, []);

  useEffect(() => {
    if (video && video.id) {
      const existingHistory = JSON.parse(localStorage.getItem('watch_history') || '[]');
      const filteredHistory = existingHistory.filter((v: any) => v.id !== video.id);
      const updatedHistory = [video, ...filteredHistory];
      localStorage.setItem('watch_history', JSON.stringify(updatedHistory));
    }
  }, [video]);

  useEffect(() => {
    if (video && video.id) {
      const saveSavedVideos = JSON.parse(localStorage.getItem('saved_video') || '[]');
      const isSavedVal = saveSavedVideos.some((v: any) => v.id === video.id);
      setIsSaved(isSavedVal);
    }
  }, [video]);

  useEffect(() => {
    if (video && video.id) {
      const saveLikedVideos = JSON.parse(localStorage.getItem('like_video') || '[]');
      const isLikedVal = saveLikedVideos.some((v: any) => v.id === video.id);
      setIsLiked(isLikedVal);
    }
  }, [video]);

  useEffect(() => {
    if (video && video.snippet?.channelId) {
      const savedSubs = JSON.parse(localStorage.getItem('subscribed_channels') || '[]');
      const isSubbed = savedSubs.some((sub: any) => sub.id === video.snippet.channelId);
      setIsSubscribed(isSubbed);
    }
  }, [video]);

  const getVideoId = (v: any) => {
    if (!v) return '';
    if (typeof v.id === 'object' && v.id !== null) {
      return v.id.videoId || v.id;
    }
    return v.id;
  };

  const getHashtags = (text: string) => {
    if (!text) return "";
    const hashtagRegex = /#(?!\d)\w+/g;
    const matches = text.match(hashtagRegex) || [];
    const tags = matches.slice(0, 3);
    return tags.join(' ');
  };

  const getSubcriber = (subcriber: string) => {
    const totalSubcriber: number = Number(subcriber);
    if (isNaN(totalSubcriber)) return '0';
    if (totalSubcriber < 1000) return `${totalSubcriber}`;
    if (totalSubcriber < 1000000) return `${Math.floor(totalSubcriber / 1000)}K`;
    if (totalSubcriber < 1000000000) return `${Math.floor(totalSubcriber / 1000000)}M`;
    return `${Math.floor(totalSubcriber / 1000000000)}B`;
  };

  const getTimeago = (date: string) => {
    if (!date) return '';
    const videoDate = new Date(date);
    const currentTime = new Date();
    const timeAgo = Math.floor((currentTime.getTime() - videoDate.getTime()) / 1000);

    if (timeAgo < 60) return `${timeAgo} seconds ago`;
    if (timeAgo < 3600) {
      const minutes = Math.floor(timeAgo / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    if (timeAgo < 86400) {
      const hours = Math.floor(timeAgo / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    if (timeAgo < 604800) {
      const days = Math.floor(timeAgo / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    if (timeAgo < 2592000) {
      const weeks = Math.floor(timeAgo / 604800);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    if (timeAgo < 31536000) {
      const months = Math.floor(timeAgo / 2592000);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    const years = Math.floor(timeAgo / 31536000);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  };

  const getView = (view: string) => {
    const totalView: number = Number(view);
    if (isNaN(totalView)) return '0 views';
    if (totalView < 1000) return `${view} views`;
    if (totalView < 1000000) return `${Math.floor(totalView / 1000)}K views`;
    if (totalView < 1000000000) return `${Math.floor(totalView / 1000000)}M views`;
    return `${Math.floor(totalView / 1000000000)}B views`;
  };

  const getTimeDescription = (date: string) => {
    if (!date) return '';
    const videoDate = new Date(date);
    const dayandmonth: string = videoDate.toDateString().slice(4, 10);
    const year: string = videoDate.toDateString().slice(11, 16);
    return `${dayandmonth}, ${year}`;
  };

  const getLike = (like: string) => {
    const totalLike: number = Number(like);
    if (isNaN(totalLike)) return '0';
    if (totalLike < 1000) return `${like}`;
    if (totalLike < 1000000) return `${Math.floor(totalLike / 1000)}K`;
    if (totalLike < 1000000000) return `${Math.floor(totalLike / 1000000)}M`;
    return `${Math.floor(totalLike / 1000000000)}B`;
  };

  return (
    <div className="w-full mx-auto py-0 flex flex-col lg:flex-row gap-5 text-[#f1f1f1]">
      {/* LEFT COLUMN */}
      <div className="flex-1 min-w-0">
        <div className="w-full rounded-2xl overflow-hidden aspect-video bg-black shadow-2xl border border-[#212121]">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <h1 className="text-lg md:text-xl font-sans font-bold mt-4 leading-snug">
          {video?.snippet?.title || "..Loading.."}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-3 pb-4 border-b border-[#2d2d2d]">
          <div className="flex items-center gap-3">
            <img
              src={video1?.snippet?.thumbnails?.medium?.url || "..Loading.."}
              className="w-10 h-10 rounded-full object-cover border border-[#303030]"
            />
            <div className="flex flex-col">
              <span
                onClick={goChannel}
                className="font-sans font-semibold text-sm hover:text-white cursor-pointer"
              >
                {video?.snippet?.channelTitle || "Loading..."}
              </span>
              <span className="text-xs text-gray-400">
                {getSubcriber(video1?.statistics?.subscriberCount)} subscribers
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

          <div className="flex items-center gap-2 overflow-x-auto py-0">
            <div className="flex items-center bg-[#212121] rounded-full border border-[#303030]/50 shrink-0">
              <button
                onClick={handleLikeToggle}
                className={`flex items-center gap-1.5 px-4 py-2 hover:bg-[#303030] rounded-l-full border-r border-[#303030] transition text-xs font-semibold cursor-pointer ${
                  isLiked ? 'text-[#ff0000]' : 'text-[#f1f1f1]'
                }`}
              >
                {isLiked ? null : <img src="/public/notlike.png" className="w-4 h-4" />}
                {getLike(video?.statistics?.likeCount)} likes
              </button>
              <button
                onClick={() => setDisIsLiked(!isdisLiked)}
                className={`px-4 py-2 hover:bg-[#303030] rounded-r-full text-[#f1f1f1] flex items-center gap-1.5 transition text-xs font-semibold cursor-pointer ${
                  isdisLiked ? 'text-[#ff0000]' : 'text-[#f1f1f1]'
                }`}
              >
                {isdisLiked ? null : <img src="/public/notdislike.png" className="w-4 h-4" />}
                dislike
              </button>
            </div>

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
                  <img src="/public/savetoplaylist.png" className="h-4 w-4" />
                  Watch Later
                </>
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsShareModal(true);
              }}
              className="flex items-center px-4 py-2 bg-[#212121] hover:bg-[#303030] border border-[#303030]/50 rounded-full transition text-xs font-semibold shrink-0 cursor-pointer"
            >
              <img alt="Share" src="/public/share.png" className="h-4 w-4 mr-2" />
              Share
            </button>

            <button
              onClick={() => window.open(`https://youtube.com/watch?v=${videoId}`, '_blank')}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#212121] hover:bg-[#303030] border border-[#303030]/50 rounded-full transition text-xs font-semibold shrink-0 cursor-pointer"
            >
              Youtube
            </button>
          </div>
        </div>

        <DescriptionBox
          video={video}
          isExpanded={isExpandedDecription}
          setIsExpanded={setisExpandedDecription}
          getView={getView}
          getTimeago={getTimeago}
          getTimeDescription={getTimeDescription}
          getHashtags={getHashtags}
          handleDescription={handleDescription}
        />

        <CommentSection
          comments={comments}
          commentText={commentText}
          setCommentText={setCommentText}
          isAddComment={isAddComment}
          setIsAddComment={setIsAddComment}
          handlePostComment={handlePostComment}
          commentCount={video?.statistics?.commentCount}
          getTimeago={getTimeago}
        />
      </div>

      {/* RIGHT COLUMN (SIDEBAR) */}
      <UpNext
        listId={listId}
        listType={listType}
        playListVideo={playListVideo}
        upNextVideos={upNextVideos}
        videoId={videoId}
        activeMenuId={activeMenuId}
        setActiveMenuId={setActiveMenuId}
        goWatch={goWatch}
        getTimeago={getTimeago}
        addVideoToList={addVideoToList}
        removeVideoFromList={removeVideoFromList}
        handleCopyURL={handleCopyURL}
        shareToFacebook={shareToFacebook}
        shareToX={shareToX}
        shareToLinkedin={shareToLinkedin}
        shareToReddit={shareToReddit}
        watchLaterVideoList={watchLaterVideoList}
        handleSaveToggleUpNext={handleSaveToggleUpNext}
        currentVideo={video}
      />

      <ShareModal
        isOpen={isShareModal}
        onClose={() => setIsShareModal(false)}
        videoId={video?.id || ''}
        videoTitle={video?.snippet?.title || ''}
        showNotice={showNotice}
      />

      {noticeMessage && (
        <div className="fixed bottom-6 z-[100] left-1/2 -translate-x-1/2 px-4 py-2 bg-white border border-neutral-700 text-black text-sm font-semibold rounded-xl shadow-2xl transition-all animate-fade-in flex items-center gap-2">
          <span>{noticeMessage}</span>
        </div>
      )}
    </div>
  );
}