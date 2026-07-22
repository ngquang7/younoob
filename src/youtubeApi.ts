import type {
  YouTubeChannel,
  YouTubeListResponse,
  YouTubePlaylistItem,
  YouTubeSearchItem,
  YouTubeVideo,
} from "./type.ts";

const API_BASE_URL = "https://www.googleapis.com/youtube/v3";

const API_KEY: string | undefined =
  import.meta.env.VITE_YOUTUBE_API_KEY;

interface YouTubeErrorResponse {
  error?: {
    code: number;
    message: string;
    status?: string;
  };
}

async function youtubeRequest<T>(
  endpoint: string,
  parameters: Record<string, string>,
  signal?: AbortSignal
): Promise<T> {
  if (!API_KEY) {
    throw new Error("VITE_YOUTUBE_API_KEY is not configured.");
  }

  const url = new URL(`${API_BASE_URL}/${endpoint}`);

  Object.entries({
    ...parameters,
    key: API_KEY,
  }).forEach(([name, value]) => {
    url.searchParams.set(name, value);
  });

  const response = await fetch(url, { signal });

  if (!response.ok) {
    const errorData =
      (await response.json().catch(() => ({}))) as YouTubeErrorResponse;

    throw new Error(
      errorData.error?.message ??
        `YouTube request failed with status ${response.status}.`
    );
  }

  return (await response.json()) as T;
}

export interface SearchVideosOptions {
  query: string;
  maxResults?: number;
  pageToken?: string;
  channelId?: string;
  order?: "date" | "rating" | "relevance" | "title" | "viewCount";
  regionCode?: string;
}

export function searchVideos(
  options: SearchVideosOptions,
  signal?: AbortSignal
): Promise<YouTubeListResponse<YouTubeSearchItem>> {
  const parameters: Record<string, string> = {
    part: "snippet",
    q: options.query,
    type: "video",
    maxResults: String(options.maxResults ?? 10),
    order: options.order ?? "relevance",
  };

  if (options.pageToken) {
    parameters.pageToken = options.pageToken;
  }

  if (options.channelId) {
    parameters.channelId = options.channelId;
  }

  if (options.regionCode) {
    parameters.regionCode = options.regionCode;
  }

  return youtubeRequest<YouTubeListResponse<YouTubeSearchItem>>(
    "search",
    parameters,
    signal
  );
}