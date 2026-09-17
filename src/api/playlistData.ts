// src/api/youtubePlaylistMeta.ts
import axios from "axios";

export interface YouTubeThumbnail {
    url: string;
    width: number;
    height: number;
}

export interface YouTubePlaylistResource {
    kind: "youtube#playlist";
    etag: string;
    id: string;
    snippet: {
        publishedAt: string;
        channelId: string;
        title: string;
        description: string;
        thumbnails: {
            default?: YouTubeThumbnail;
            medium?: YouTubeThumbnail;
            high?: YouTubeThumbnail;
            standard?: YouTubeThumbnail;
            maxres?: YouTubeThumbnail;
        };
        channelTitle: string;
        defaultLanguage?: string;
        localized?: {
            title: string;
            description: string;
        };
    };
    status?: {
        privacyStatus: string;
        podcastStatus?: string;
    };
    contentDetails?: {
        itemCount: number;
    };
    player?: {
        embedHtml: string;
    };
    localizations?: Record<string, {
        title: string;
        description: string;
    }>;
}

export interface YouTubePlaylistListResponse {
    kind: string;
    etag: string;
    nextPageToken?: string;
    prevPageToken?: string;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    items: YouTubePlaylistResource[];
}

const youtubeApi = axios.create({
    baseURL: "https://www.googleapis.com/youtube/v3",
    timeout: 10_000,
});

export async function getPlaylistDetails(
    playlistIds: string | string[]
): Promise<YouTubePlaylistListResponse> {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    if (!apiKey) {
        throw new Error("YouTube API key is missing.");
    }

    const idParam = Array.isArray(playlistIds) ? playlistIds.join(",") : playlistIds;

    const { data } = await youtubeApi.get<YouTubePlaylistListResponse>("/playlists", {
        params: {
            part: "snippet,status,contentDetails,player,localizations",
            id: idParam,
            key: apiKey,
        },
    });

    return data;
}