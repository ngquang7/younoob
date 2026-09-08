export const storageService = {
  // History
  getHistory: () => JSON.parse(localStorage.getItem('watch_history') || '[]'),
  saveHistory: (video: any) => {
    if (!video) return;
    const history = storageService.getHistory();
    const videoId = video.id || video?.id?.videoId;
    const filtered = history.filter((v: any) => (v.id || v?.id?.videoId) !== videoId);
    localStorage.setItem('watch_history', JSON.stringify([video, ...filtered]));
  },

  // Like videos
  getLiked: () => JSON.parse(localStorage.getItem('like_video') || '[]'),
  toggleLike: (video: any) => {
    const liked = storageService.getLiked();
    const videoId = video.id || video?.id?.videoId;
    const exists = liked.some((v: any) => (v.id || v?.id?.videoId) === videoId);
    const updated = exists ? liked.filter((v: any) => (v.id || v?.id?.videoId) !== videoId) : [video, ...liked];
    localStorage.setItem('like_video', JSON.stringify(updated));
    return !exists;
  },

  // Watch Later (Saved)
  getSaved: () => JSON.parse(localStorage.getItem('saved_video') || '[]'),
  toggleSave: (video: any) => {
    const saved = storageService.getSaved();
    const videoId = video.id || video?.id?.videoId;
    const exists = saved.some((v: any) => (v.id || v?.id?.videoId) === videoId);
    const updated = exists ? saved.filter((v: any) => (v.id || v?.id?.videoId) !== videoId) : [video, ...saved];
    localStorage.setItem('saved_video', JSON.stringify(updated));
    return !exists;
  },

  // Subscriptions
  getSubscribedChannels: () => JSON.parse(localStorage.getItem('subscribed_channels') || '[]'),
  toggleSubscribe: (channelData: any) => {
    const subs = storageService.getSubscribedChannels();
    const channelId = channelData?.id || channelData?.channelId;
    const exists = subs.some((c: any) => (c.id || c?.channelId) === channelId);
    const updated = exists ? subs.filter((c: any) => (c.id || c?.channelId) !== channelId) : [channelData, ...subs];
    localStorage.setItem('subscribed_channels', JSON.stringify(updated));
    return !exists;
  }
};