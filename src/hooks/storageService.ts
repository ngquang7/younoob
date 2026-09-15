export const storageService = {
  //History
  getHistory: () => JSON.parse(localStorage.getItem('watch_history') || '[]'),
  
  saveHistory: (video: any) => {
    if (!video) return;
    const history = storageService.getHistory();
    const videoId = video.id || video?.id?.videoId;
    const filtered = history.filter((v: any) => (v.id || v?.id?.videoId) !== videoId);
    localStorage.setItem('watch_history', JSON.stringify([video, ...filtered]));
  },

  removeHistoryItem: (id: string) => {
    const history = storageService.getHistory();
    const updated = history.filter((v: any) => (v.id || v?.id?.videoId) !== id);
    localStorage.setItem('watch_history', JSON.stringify(updated));
    return updated;
  },

  clearAllHistory: () => {
    localStorage.removeItem('watch_history');
  },

  //Liked Videos
  getLiked: () => JSON.parse(localStorage.getItem('like_video') || '[]'),
  
  addToLiked: (video: any) => {
    if (!video) return;
    const liked = storageService.getLiked();
    const videoId = video.id || video?.id?.videoId;
    const exists = liked.some((v: any) => (v.id || v?.id?.videoId) === videoId);
    if (!exists) {
      const updated = [video, ...liked];
      localStorage.setItem('like_video', JSON.stringify(updated));
    }
  },

  removeFromLiked: (videoId: string) => {
    const liked = storageService.getLiked();
    const updated = liked.filter((v: any) => (v.id || v?.id?.videoId) !== videoId);
    localStorage.setItem('like_video', JSON.stringify(updated));
  },

  toggleLike: (video: any) => {
    const liked = storageService.getLiked();
    const videoId = video.id || video?.id?.videoId;
    const exists = liked.some((v: any) => (v.id || v?.id?.videoId) === videoId);
    if (exists) {
      storageService.removeFromLiked(videoId);
    } else {
      storageService.addToLiked(video);
    }
    return !exists;
  },

  //Watch Later / Saved
  getSaved: () => JSON.parse(localStorage.getItem('saved_video') || '[]'),
  
  addToSaved: (video: any) => {
    if (!video) return;
    const saved = storageService.getSaved();
    const videoId = video.id || video?.id?.videoId;
    const exists = saved.some((v: any) => (v.id || v?.id?.videoId) === videoId);
    if (!exists) {
      const updated = [video, ...saved];
      localStorage.setItem('saved_video', JSON.stringify(updated));
    }
  },

  removeFromSaved: (videoId: string) => {
    const saved = storageService.getSaved();
    const updated = saved.filter((v: any) => (v.id || v?.id?.videoId) !== videoId);
    localStorage.setItem('saved_video', JSON.stringify(updated));
  },

  toggleSave: (video: any) => {
    const saved = storageService.getSaved();
    const videoId = video.id || video?.id?.videoId;
    const exists = saved.some((v: any) => (v.id || v?.id?.videoId) === videoId);
    if (exists) {
      storageService.removeFromSaved(videoId);
    } else {
      storageService.addToSaved(video);
    }
    return !exists;
  },

  //Playlists
  getPlaylists: () => JSON.parse(localStorage.getItem('playlists') || '[]'),

  createPlaylist: (name: string) => {
    const playlists = storageService.getPlaylists();
    const newPlaylist = { id: Date.now().toString(), name, videos: [] };
    localStorage.setItem('playlists', JSON.stringify([...playlists, newPlaylist]));
    return newPlaylist;
  },

  deletePlaylist: (playlistId: string) => {
    const playlists = storageService.getPlaylists();
    const updated = playlists.filter((p: any) => p.id !== playlistId);
    localStorage.setItem('playlists', JSON.stringify(updated));
  },

  addToPlaylist: (playlistId: string, video: any) => {
    const playlists = storageService.getPlaylists();
    const updated = playlists.map((p: any) => {
      if (p.id === playlistId) {
        const videoId = video.id || video?.id?.videoId;
        const exists = p.videos.some((v: any) => (v.id || v?.id?.videoId) === videoId);
        if (!exists) {
          return { ...p, videos: [video, ...p.videos] };
        }
      }
      return p;
    });
    localStorage.setItem('playlists', JSON.stringify(updated));
  },

  removeFromPlaylist: (playlistId: string, videoId: string) => {
    const playlists = storageService.getPlaylists();
    const updated = playlists.map((p: any) => {
      if (p.id === playlistId) {
        return {
          ...p,
          videos: p.videos.filter((v: any) => (v.id || v?.id?.videoId) !== videoId)
        };
      }
      return p;
    });
    localStorage.setItem('playlists', JSON.stringify(updated));
  },

  //Subscriptions
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