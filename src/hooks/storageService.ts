const API_URL = 'http://localhost:5000/api';
const TOKEN_KEY = 'youtubefake_token';

const ACCOUNT_KEYS = [
  'watch_history',
  'like_video',
  'saved_video',
  'subscribed_channels',
] as const;

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function authFetch(path: string, options: RequestInit = {}): Promise<Response> | null {
  const token = getToken();
  if (!token) return null;

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}

function getVideoId(video: any): string | undefined {
  return typeof video === 'string' ? video : video?.id || video?.id?.videoId;
}

export const storageService = {
  // Pull all account data from MySQL on login / page reload
  syncFromServer: async (): Promise<void> => {
    const token = getToken();
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [historyRes, likesRes, savedRes, subsRes] = await Promise.all([
        fetch(`${API_URL}/history`, { headers }),
        fetch(`${API_URL}/likes`, { headers }),
        fetch(`${API_URL}/saved`, { headers }),
        fetch(`${API_URL}/subscriptions`, { headers }),
      ]);

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        const mappedHistory = Array.isArray(historyData)
          ? historyData.map((item: any) =>
              item?.video_data
                ? typeof item.video_data === 'string'
                  ? JSON.parse(item.video_data)
                  : item.video_data
                : item
            )
          : [];
        localStorage.setItem('watch_history', JSON.stringify(mappedHistory));
      } else {
        console.error('GET /history failed:', historyRes.status);
      }

      if (likesRes.ok) {
        localStorage.setItem('like_video', JSON.stringify(await likesRes.json()));
      } else {
        console.error('GET /likes failed:', likesRes.status);
      }

      if (savedRes.ok) {
        localStorage.setItem('saved_video', JSON.stringify(await savedRes.json()));
      } else {
        console.error('GET /saved failed:', savedRes.status);
      }

      if (subsRes.ok) {
        const subs = await subsRes.json();
        const mapped = subs.map((s: any) =>
          s.channel_data
            ? typeof s.channel_data === 'string'
              ? JSON.parse(s.channel_data)
              : s.channel_data
            : {
                id: s.channel_id,
                channelId: s.channel_id,
                snippet: {
                  title: s.channel_title,
                  thumbnails: { default: { url: s.channel_thumbnail } },
                },
              }
        );
        localStorage.setItem('subscribed_channels', JSON.stringify(mapped));
      } else {
        console.error('GET /subscriptions failed:', subsRes.status);
      }

      window.dispatchEvent(new Event('younoob_storage_updated'));
    } catch (err) {
      console.error('Failed to sync account data from MySQL:', err);
    }
  },

  // Clear local cache on logout so switching users starts clean
  clearLocalAccountData: (): void => {
    for (const key of ACCOUNT_KEYS) {
      localStorage.removeItem(key);
    }
    window.dispatchEvent(new Event('younoob_storage_updated'));
  },

  // History
  getHistoryPaused: () => localStorage.getItem('pause_watch_history') === 'true',
  toggleHistoryPause: () => {
    const nextState = !storageService.getHistoryPaused();
    localStorage.setItem('pause_watch_history', String(nextState));
    return nextState;
  },

  getHistory: () => JSON.parse(localStorage.getItem('watch_history') || '[]'),

  saveHistory: (video: any) => {
    if (storageService.getHistoryPaused() || !video) return;
    const videoId = getVideoId(video);
    if (!videoId) return;

    const history = storageService.getHistory();
    const filtered = history.filter((v: any) => getVideoId(v) !== videoId);
    localStorage.setItem('watch_history', JSON.stringify([video, ...filtered]));

    authFetch('/history', {
      method: 'POST',
      body: JSON.stringify({ video }),
    })
      ?.then(async (res) => {
        if (!res.ok) {
          console.error('POST /history failed:', res.status, await res.text());
        }
      })
      .catch(console.error);
  },

  removeHistoryItem: (id: string) => {
    const updated = storageService
      .getHistory()
      .filter((v: any) => getVideoId(v) !== id);
    localStorage.setItem('watch_history', JSON.stringify(updated));

    authFetch(`/history/${encodeURIComponent(id)}`, { method: 'DELETE' })?.catch(console.error);
    return updated;
  },

  clearAllHistory: () => {
    localStorage.setItem('watch_history', '[]');
    authFetch('/history', { method: 'DELETE' })?.catch(console.error);
  },

  // Liked Videos
  getLiked: () => JSON.parse(localStorage.getItem('like_video') || '[]'),

  addToLiked: (video: any) => {
    if (!video) return;
    const videoId = getVideoId(video);
    if (!videoId) return;

    const liked = storageService.getLiked();
    if (!liked.some((v: any) => getVideoId(v) === videoId)) {
      localStorage.setItem('like_video', JSON.stringify([video, ...liked]));
      authFetch('/likes', {
        method: 'POST',
        body: JSON.stringify({ video }),
      })?.catch(console.error);
    }
  },

  removeFromLiked: (videoId: string) => {
    const updated = storageService
      .getLiked()
      .filter((v: any) => getVideoId(v) !== videoId);
    localStorage.setItem('like_video', JSON.stringify(updated));
    authFetch(`/likes/${encodeURIComponent(videoId)}`, { method: 'DELETE' })?.catch(console.error);
  },

  toggleLike: (video: any) => {
    const videoId = getVideoId(video);
    if (!videoId) return false;
    const exists = storageService
      .getLiked()
      .some((v: any) => getVideoId(v) === videoId);
    if (exists) {
      storageService.removeFromLiked(videoId);
    } else {
      storageService.addToLiked(video);
    }
    return !exists;
  },

  // Watch Later / Saved
  getSaved: () => JSON.parse(localStorage.getItem('saved_video') || '[]'),

  addToSaved: (video: any) => {
    if (!video) return;
    const videoId = getVideoId(video);
    if (!videoId) return;

    const saved = storageService.getSaved();
    if (!saved.some((v: any) => getVideoId(v) === videoId)) {
      localStorage.setItem('saved_video', JSON.stringify([video, ...saved]));
      authFetch('/saved', {
        method: 'POST',
        body: JSON.stringify({ video }),
      })?.catch(console.error);
    }
  },

  removeFromSaved: (videoId: string) => {
    const updated = storageService
      .getSaved()
      .filter((v: any) => getVideoId(v) !== videoId);
    localStorage.setItem('saved_video', JSON.stringify(updated));
    authFetch(`/saved/${encodeURIComponent(videoId)}`, { method: 'DELETE' })?.catch(console.error);
  },

  toggleSave: (video: any) => {
    const videoId = getVideoId(video);
    if (!videoId) return false;
    const exists = storageService
      .getSaved()
      .some((v: any) => getVideoId(v) === videoId);
    if (exists) {
      storageService.removeFromSaved(videoId);
    } else {
      storageService.addToSaved(video);
    }
    return !exists;
  },

  // Subscriptions
  getSubscribedChannels: () => JSON.parse(localStorage.getItem('subscribed_channels') || '[]'),

  toggleSubscribe: (channelData: any) => {
    const subs = storageService.getSubscribedChannels();
    const channelId = channelData?.id || channelData?.channelId;
    const exists = subs.some((c: any) => (c.id || c?.channelId) === channelId);
    const updated = exists
      ? subs.filter((c: any) => (c.id || c?.channelId) !== channelId)
      : [channelData, ...subs];

    localStorage.setItem('subscribed_channels', JSON.stringify(updated));

    if (exists) {
      authFetch(`/subscriptions/${encodeURIComponent(channelId)}`, { method: 'DELETE' })?.catch(
        console.error
      );
    } else {
      authFetch('/subscriptions', {
        method: 'POST',
        body: JSON.stringify({
          channelId,
          channelTitle: channelData?.snippet?.title || channelData?.title || null,
          channelThumbnail:
            channelData?.snippet?.thumbnails?.default?.url || channelData?.thumbnail || null,
          channelData,
        }),
      })?.catch(console.error);
    }

    return !exists;
  },
};