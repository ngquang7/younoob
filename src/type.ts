import type { YoutubeVideo } from "./api/youtube";

export interface YouTubeThumbnail {
  url: string;
  width?: number;
  height?: number;
}

export interface YouTubeThumbnails {
  default?: YouTubeThumbnail;
  medium?: YouTubeThumbnail;
  high?: YouTubeThumbnail;
  standard?: YouTubeThumbnail;
  maxres?: YouTubeThumbnail;
}

export interface YouTubeListResponse<T> {
  items: T[];
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface YouTubeSearchItem {
  id: {
    kind: string;
    videoId?: string;
    channelId?: string;
    playlistId?: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    channelTitle: string;
    thumbnails: YouTubeThumbnails;
  };
  statistic : {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  }
}

export interface YouTubeVideo {
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    channelTitle: string;
    thumbnails: YouTubeThumbnails;
    tags?: string[];
  };
  contentDetails?: {
    duration: string;
    definition: string;
    caption: string;
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
}

export interface YouTubeChannel {
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl?: string;
    publishedAt: string;
    thumbnails: YouTubeThumbnails;
  };
  statistics?: {
    viewCount?: string;
    subscriberCount?: string;
    hiddenSubscriberCount?: boolean;
    videoCount?: string;
  };
  contentDetails?: {
    relatedPlaylists: {
      uploads: string;
      likes?: string;
    };
  };
}

export interface YouTubePlaylistItem {
  id: string;
  snippet: {
    publishedAt: string;
    title: string;
    description: string;
    channelTitle: string;
    position: number;
    thumbnails: YouTubeThumbnails;
    resourceId: {
      kind: string;
      videoId: string;
    };
  };
  contentDetails?: {
    videoId: string;
    videoPublishedAt?: string;
  };
}