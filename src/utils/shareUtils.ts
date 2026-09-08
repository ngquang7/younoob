// src/utils/shareUtils.ts

export const getYouTubeUrl = (videoId: string): string => {
  return `https://www.youtube.com/watch?v=${videoId}`;
};

export const cleanVideoTitle = (title?: string): string => {
  if (!title) return '';
  return title.replace(/\s*\(playlist\)/gi, '').trim();
};

export const shareToFacebook = (videoId: string): void => {
  if (!videoId) return;
  const youtubeUrl = getYouTubeUrl(videoId);
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(youtubeUrl)}`;
  window.open(facebookShareUrl, '_blank');
};

export const shareToX = (videoId: string, videoTitle?: string): void => {
  if (!videoId) return;
  const youtubeUrl = getYouTubeUrl(videoId);
  const text = encodeURIComponent(cleanVideoTitle(videoTitle));
  const xShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(youtubeUrl)}&text=${text}`;
  window.open(xShareUrl, '_blank');
};

export const shareToLinkedin = (videoId: string): void => {
  if (!videoId) return;
  const youtubeUrl = getYouTubeUrl(videoId);
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(youtubeUrl)}`;
  window.open(linkedinShareUrl, '_blank');
};

export const shareToReddit = (videoId: string, videoTitle?: string): void => {
  if (!videoId) return;
  const youtubeUrl = getYouTubeUrl(videoId);
  const text = encodeURIComponent(cleanVideoTitle(videoTitle));
  const redditShareUrl = `https://reddit.com/submit?url=${encodeURIComponent(youtubeUrl)}&title=${text}`;
  window.open(redditShareUrl, '_blank');
};

export const handleCopyURL = (videoId: string, showNotice?: (msg: string) => void): void => {
  const youtubeUrl = getYouTubeUrl(videoId);
  try {
    navigator.clipboard.writeText(youtubeUrl);
    if (showNotice) {
      showNotice("Copy successfully");
    }
  } catch (error) {
    console.warn("Copy failed ", error);
    if (showNotice) {
      showNotice("Copy failed!");
    }
  }
};