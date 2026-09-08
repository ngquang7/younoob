import { useState, useEffect } from 'react';
import { storageService } from './storageService';

export function useVideoActions(video: any, channelData: any) {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const videoId = video?.id || video?.id?.videoId;
    const channelId = channelData?.id || channelData?.channelId;

    // Đồng bộ state khi video hoặc channel thay đổi
    useEffect(() => {
        if (videoId) {
            const likedList = storageService.getLiked();
            setIsLiked(likedList.some((v: any) => (v.id || v?.id?.videoId) === videoId));

            const savedList = storageService.getSaved();
            setIsSaved(savedList.some((v: any) => (v.id || v?.id?.videoId) === videoId));
        }
    }, [videoId]);

    useEffect(() => {
        if (channelId) {
            const subList = storageService.getSubscribedChannels();
            setIsSubscribed(subList.some((c: any) => (c.id || c?.channelId) === channelId));
        }
    }, [channelId]);

    const handleLikeToggle = () => {
        const newState = storageService.toggleLike(video);
        setIsLiked(newState);
    };

    const handleSaveToggle = () => {
        const newState = storageService.toggleSave(video);
        setIsSaved(newState);
    };

    const handleSubscribeToggle = () => {
        const nextState = !isSubscribed;
        setIsSubscribed(nextState);
        const savedSubs = JSON.parse(localStorage.getItem('subscribed_channels') || '[]');

        // Hỗ trợ lấy linh hoạt từ nhiều cấu trúc dữ liệu khác nhau của channel/video
        const channelId = video?.snippet?.channelId || channelData?.id || 'unknown_id';
        const channelTitle = video?.snippet?.channelTitle || channelData?.snippet?.title || 'Channel Name';

        // Lấy thumbnail an toàn từ channelData hoặc video snippet
        const thumbnail =
            channelData?.snippet?.thumbnails?.medium?.url ||
            channelData?.snippet?.thumbnails?.default?.url ||
            video?.snippet?.thumbnails?.medium?.url ||
            '';

        const currentChannel = {
            id: channelId,
            title: channelTitle,
            thumbnail: thumbnail,
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
    return {
        isLiked,
        isSaved,
        isSubscribed,
        handleLikeToggle,
        handleSaveToggle,
        handleSubscribeToggle,
    };
}