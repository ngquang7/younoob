export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelId: string;
  channelTitle: string;
  channelAvatar: string;
  views: number;
  publishedAt: string;
  duration: string;
  likeCount?: number;
  tags?: string[];
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  publishedAt: string;
  likeCount: number;
}

export interface Channel {
  id: string;
  title: string;
  avatar: string;
  subscriberCount: string;
  description: string;
}

export interface SearchResult {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelId: string;
  channelTitle: string;
  channelAvatar: string;
  publishedAt: string;
}
