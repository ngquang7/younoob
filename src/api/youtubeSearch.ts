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
  query: string,
  pageToken?: string
): Promise<YouTubeSearchResponse> {
  // const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("YouTube API key is missing.");
  }

  const { data } = await youtubeApi.get<YouTubeSearchResponse>("/search", {
    params: {
      part: "snippet",
      q: query,
      type: "video",
      maxResults: 1000,
      pageToken,
      key: apiKey,
    },
  });
  return data;
}