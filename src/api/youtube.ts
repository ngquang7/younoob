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
    thumbnails: {
      default: YouTubeThumbnail;
      medium: YouTubeThumbnail;
      high: YouTubeThumbnail;
    };
  };
}

export interface YouTubeSearchResponse {
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
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
  const apiKey = "VITE_YOUTUBE_API_KEY";
  if (!apiKey) {
    throw new Error("YouTube API key is missing.");
  }

  const { data } = await youtubeApi.get<YouTubeSearchResponse>("/search", {
    params: {
      part: "snippet",
      q: query,
      type: "video",
      maxResults: 10,
      pageToken,
      key: apiKey,
    },
  });
  return data;
}