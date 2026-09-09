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
import VideoInfoSection from './VideoInfoSection';

import { useWatchHistory } from '../hooks/useWatchHistory';
import { useVideoActions } from '../hooks/useVideoAction';

import { formatSubcriberCount } from '../utils/formatSubcriberCount';
import { formatTimeAgo } from '../utils/formatTimeAgo';
import { formatView } from '../utils/formatView';
import { formatDateTime } from '../utils/formatDateTime';
import { formatLike } from '../utils/formatLike';
export default function WatchCom() {
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
    const [loading, setLoading] = useState<boolean>(false);

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
    }, [videoId]);

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
                        className="text-[#3ea6ff] hover:inline-block"
                        onClick={(e) => e.stopPropagation()}
                        title={word}
                    >
                        {displayUrl}
                    </a>
                );
            } else if (word.match(hashtagRegex)) {
                const cleanWord = word.replace('#', '');
                return (
                    <span
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/search?q=${cleanWord}`);
                        }}
                        className="text-[#3ea6ff] font-medium hover:inline-block cursor-pointer"
                    >
                        {word}
                    </span>
                );
            }
            return word;
        });
    };

    useWatchHistory(video);
    const {
        isLiked,
        isSaved,
        isSubscribed,
        handleLikeToggle,
        handleSaveToggle,
        handleSubscribeToggle,
    } = useVideoActions(video, video1 || video) as any;

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

                <VideoInfoSection
                    video={video}
                    video1={video1}
                    videoId={videoId}
                    goChannel={goChannel}
                    getLike={formatLike}
                    isSubscribed={isSubscribed}
                    handleSubscribeToggle={handleSubscribeToggle}
                    isLiked={isLiked}
                    handleLikeToggle={handleLikeToggle}
                    isdisLiked={isdisLiked}
                    setIsDisLiked={setDisIsLiked}
                    isSaved={isSaved}
                    handleSaveToggle={handleSaveToggle}
                    onOpenShare={() => setIsShareModal(true)}
                />

                <DescriptionBox
                    video={video}
                    isExpanded={isExpandedDecription}
                    setIsExpanded={setisExpandedDecription}
                    getView={formatView}
                    getTimeago={formatTimeAgo}
                    getTimeDescription={formatDateTime}
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
                    getTimeago={formatTimeAgo}
                />
            </div>

            {/* RIGHT COLUMN (SIDEBAR) */}
            <div className="lg:w-[380px] shrink-0 flex flex-col gap-3 -mr-3">
                <UpNext
                    listId={listId}
                    listType={listType}
                    playListVideo={playListVideo}
                    upNextVideos={upNextVideos}
                    videoId={videoId}
                    activeMenuId={activeMenuId}
                    setActiveMenuId={setActiveMenuId}
                    goWatch={goWatch}
                    getTimeago={formatTimeAgo}
                    addVideoToList={addVideoToList}
                    removeVideoFromList={removeVideoFromList}
                    watchLaterVideoList={watchLaterVideoList}
                    handleSaveToggleUpNext={handleSaveToggleUpNext}
                    currentVideo={video}
                />
            </div>
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