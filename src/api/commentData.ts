import axios from "axios";
export interface YouTubeCommentResponse {
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  //Change YoutubeVideo
  items: CommentResource[];
}

export interface CommentResource {
    kind: "youtube#comment";
    id: string;
    snippet: {
        videoId: string;
        textDisplay: string;
        textOriginal: string;
        authorDisplayName: string;
        authorProfileImageUrl: string;
        authorChannelUrl?: string;
        likeCount: number;
        publishedAt: string;
        updatedAt: string;
    };
}

const youtubeApi = axios.create({
    baseURL: "https://www.googleapis.com/youtube/v3",
    timeout: 10_000,
});


export async function getCommentData(
  videoIds: string
): Promise<YouTubeCommentResponse> {  
    // const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    const apiKey = (import.meta as any).env.VITE_YOUTUBE_API_KEY;
    if (!apiKey) {
        throw new Error("YouTube API key is missing.");
    }
  // Convert array to a comma-separated string if necessary (YouTube allows up to 50 IDs)
    const idParam = Array.isArray(videoIds) ? videoIds.join(",") : videoIds;

    const { data } = await youtubeApi.get<YouTubeCommentResponse>("/commentThreads", {
    params: {
    //if dont have snippet, it won't run
        part: "snippet",
        videoId: idParam,
        key: apiKey,
        maxResults: 3,
    },
    });

    return data;
}