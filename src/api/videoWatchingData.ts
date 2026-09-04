// src/api/youtubeVideo.ts
import axios from "axios";

interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YouTubeStatistics {
  viewCount: string;
  likeCount: string;
  favoriteCount: string;
  commentCount: string;
}

export interface YouTubeVideoItem {
  kind: "youtube#video";
  id: string; // Note: In the /videos endpoint, 'id' is a string, not an object!
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
      standard?: YouTubeThumbnail;
      maxres?: YouTubeThumbnail;
    };
    tags?: string[];
    categoryId: string;
  };
  statistics?: YouTubeStatistics;
}

export interface YouTubeVideoResponse {
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeVideoItem[];
}

const youtubeApi = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  timeout: 10_000,
});

/**
 * Fetch details (snippet, statistics, description, etc.) for one or multiple video IDs.
 * @param videoIds A single video ID string or an array of video IDs.
 */
export async function getVideosDetails(
  videoIds: string | string[]
): Promise<YouTubeVideoResponse> {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("YouTube API key is missing.");
  }

  // Convert array to a comma-separated string if necessary (YouTube allows up to 50 IDs)
  const idParam = Array.isArray(videoIds) ? videoIds.join(",") : videoIds;

  const { data } = await youtubeApi.get<YouTubeVideoResponse>("/videos", {
    params: {
      part: "snippet,statistics", // Requests both metadata and stats
      id: idParam,
      key: apiKey,
    },
  });

  return data;
}