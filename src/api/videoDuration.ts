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

export async function videoDuationApi(
    videoIdArray: string[],
): Promise<YouTubeSearchResponse> {
  // const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const videoId: string = videoIdArray.join(',');

  if (!apiKey) {
    throw new Error("YouTube API key is missing.");
  }

  const { data } = await youtubeApi.get<YouTubeSearchResponse>("/videos", {
    params: {
      part: "contentDetails",
      id: "videoId",
      key: apiKey,
    },
  });
  return data;
}