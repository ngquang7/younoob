// src/api/youtubeVideo.ts
import axios from "axios";

export interface YouTubeThumbnail {
    url: string;
    width: number;
    height: number;
}

export interface YouTubeChannel {
    kind: string;
    etag: string;
    id: string;
    snippet?: {
    title: string;
    description: string;
    customUrl: string;
    publishedAt: string; // ISO 8601 datetime
    thumbnails: Record<string, YouTubeThumbnail>;
    defaultLanguage?: string;
    localized?: {
        title: string;
        description: string;
    };
    country?: string;
    };
    contentDetails?: {
    relatedPlaylists: {
        likes: string;
        favorites: string;
        uploads: string;
    };
    };
    statistics?: {
    viewCount: string; // YouTube API returns large integers as strings
    subscriberCount: string; // Rounded to three significant figures for public channels
    hiddenSubscriberCount: boolean;
    videoCount: string;
    };
    topicDetails?: {
    topicIds?: string[];
    topicCategories?: string[];
    };
    status?: {
    privacyStatus: string;
    isLinked: boolean;
    longUploadsStatus: string;
    madeForKids: boolean;
    selfDeclaredMadeForKids: boolean;
    };
    brandingSettings?: {
    channel?: {
        title?: string;
        description?: string;
        keywords?: string;
        trackingAnalyticsAccountId?: string;
        unsubscribedTrailer?: string;
        defaultLanguage?: string;
        country?: string;
    };
    watch?: {
        textColor?: string;
        backgroundColor?: string;
        featuredPlaylistId?: string;
    };
    image?: {
            bannerExternalUrl?: string;
    };
    };
    auditDetails?: {
    overallGoodStanding: boolean;
    communityGuidelinesGoodStanding: boolean;
    copyrightStrikesGoodStanding: boolean;
    contentIdClaimsGoodStanding: boolean;
    };
    contentOwnerDetails?: {
    contentOwner: string;
    timeLinked: string; // ISO 8601 datetime
    };
    localizations?: Record<string, {
    title: string;
    description: string;
    }>;
}

export interface YouTubeVideoItem {
    kind: "youtube#video";
    id: string;
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
}
//This is different with the YouTubeVideoResponse
export interface YouTubeChannelResponse {
    nextPageToken?: string;
    prevPageToken?: string;
    pageInfo: {
    totalResults: number;
    resultsPerPage: number;
    };
    items: YouTubeChannel[];
}

const youtubeApi = axios.create({
    baseURL: "https://www.googleapis.com/youtube/v3",
    timeout: 10_000,
});


export async function getChannelData(
  videoIds: string | string[]
): Promise<YouTubeChannelResponse> {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    if (!apiKey) {
        throw new Error("YouTube API key is missing.");
    }
  // Convert array to a comma-separated string if necessary (YouTube allows up to 50 IDs)
    const idParam = Array.isArray(videoIds) ? videoIds.join(",") : videoIds;

    const { data } = await youtubeApi.get<YouTubeChannelResponse>("/channels", {
    params: {
    //if dont have snippet, it won't run
        part: "snippet,statistics, brandingSettings",
        id: idParam,
        key: apiKey,
    },
    });

    return data;
}