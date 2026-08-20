// src/api/youtube.ts
import axios from "axios";
interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YouTubeSearchItem {
  id: {
    kind: "youtube#video";
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    channelTitle: string;
    viewCount?: string;
    thumbnails: {
      default: YouTubeThumbnail;
      medium: YouTubeThumbnail;
      high: YouTubeThumbnail;
    };
  };
}

export interface YoutubeVideo {
  id: {
    kind: "youtube#video";
    videoId1: string;
  };
}

export interface YouTubeSearchResponse {
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  //Change YoutubeVideo
  items: YouTubeSearchItem[];
}

const youtubeApi = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  timeout: 10_000,
});

export async function searchYouTube(
  query?: string,
  pageToken?: string,
  channelId?: string
): Promise<YouTubeSearchResponse> {
  // const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("YouTube API key is missing.");
  }

  // const { data } = await youtubeApi.get<YouTubeSearchResponse>("/search", {
  //   params: {
  //     part: "snippet",
  //     q: query,
  //     type: "video",
  //     maxResults: 100,
  //     pageToken,
  //     key: apiKey,
  //   },
  // });

  // 1. Tạo object params cơ bản
  const params: any = {
    part: "snippet",
    type: "video",
    maxResults: 100,
    pageToken,
    key: apiKey,
  };

  // 2. Chỉ thêm q vào params nếu query có giá trị
  if (query) {
    params.q = query;
  }

  // 3. Chỉ thêm channelId vào params nếu channelId có giá trị (Dùng biến channelId truyền vào)
  if (channelId) {
    params.channelId = channelId;
  }

  // 4. Gọi API với object params đã xây dựng
  const { data } = await youtubeApi.get<YouTubeSearchResponse>("/search", { params });
  
  return data;
}