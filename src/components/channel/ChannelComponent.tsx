import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getChannelData } from '../../api/channelData';
import { searchYouTube, type YouTubeSearchItem } from "../../api/youtubeSearch.ts";
import ChannelBanner from './ChannelBanner.tsx';
import ChannelSection from './ChannelSection.tsx';
import { formatTimeAgo } from '../../utils/formatTimeAgo.ts';
export default function ChannelComponent() {

    const navigate = useNavigate();
    const { channelId } = useParams(); //Return channel id

    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [channel, setChannel] = useState<any>(null); //Channel
    const [channelVideo, setChannelVideo] = useState<YouTubeSearchItem[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);


    const goWatch = (videoidd: string) => navigate(`/watch?v=${videoidd}`);

    useEffect(() => {
        if (!channelId) return;
        const fetchVideo = async () => {
            try {
                const channelIn4 = await getChannelData(channelId);
                const videoChannel = await searchYouTube(undefined, undefined, channelId);
                if (channelIn4.items && channelIn4.items.length > 0) {
                    const channelItem = channelIn4.items[0];
                    setChannel(channelIn4.items);
                }
                setChannelVideo(videoChannel.items);
            } catch (error) {
                console.error("Failed to fetch video:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [channelId]);

    useEffect(() => {
        if (channelId) {
            const savedSubs = JSON.parse(localStorage.getItem('subscribed_channels') || '[]');

            // Check whether ID of current channel is in the subscription list
            const isSubbed = savedSubs.some((sub: any) => sub.id === channelId);

            // Update the state of subcribe button again
            setIsSubscribed(isSubbed);
        }
    }, []);

    const handleSubscribeToggle = () => {
        const nextState = !isSubscribed;
        setIsSubscribed(nextState);
        // get the old subcription list from localStorage
        // convert string to array
        const savedSubs = JSON.parse(localStorage.getItem('subscribed_channels') || '[]');

        // Add this channel into this localstorage, this is hashmap(key, value)
        const currentChannel = {
            id: channelId || 'unknown_id',
            title: channel?.[0]?.snippet?.title || 'Channel Name',
            thumbnail: channel?.[0]?.snippet?.thumbnails?.medium?.url || '', // avatar channel
        };

        if (nextState) {
            // if click subcribe (Subscribe): Add channel to array if it is not in array
            const exists = savedSubs.some((sub: any) => sub.id === currentChannel.id);
            if (!exists) {
                //add object(hashmap) into an array
                //we get the old subcription list and push this object to the end of array
                const updatedSubs = [...savedSubs, currentChannel];
                //localstorage only save string, so we have to convert array to string
                localStorage.setItem('subscribed_channels', JSON.stringify(updatedSubs));
            }
        } else {
            // IF WE UNSUBCRIBE (Unsubscribe): remove it from array
            const updatedSubs = savedSubs.filter((sub: any) => sub.id !== currentChannel.id);
            localStorage.setItem('subscribed_channels', JSON.stringify(updatedSubs));
        }
    };

    return (
        <div className="w-full flex flex-col">
            <div className="border-b border-gray-600 pb-3">
                <ChannelBanner bannerUrl={channel?.[0]?.brandingSettings?.image?.bannerExternalUrl} />

                <ChannelSection
                    channel={channel}
                    isSubscribed={isSubscribed}
                    handleSubscribeToggle={handleSubscribeToggle}
                />
            </div>
            {/* Videos of channel */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                {channelVideo && channelVideo.map((video: YouTubeSearchItem) => (
                    <div
                        key={video.id.videoId}
                        className="flex flex-col gap-3 group cursor-pointer transition-all duration-300 w-full hover:bg-[#272727]"
                        onClick={() => {
                            if (video.id.videoId) {
                                goWatch(video.id.videoId);
                            }
                        }}
                    >
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#212121] transition-shadow duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <img
                                src={video.snippet.thumbnails.medium?.url}
                                // alt={video.snippet.title}
                                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                            />

                            {/* Video duration */}
                        </div>

                        {/* Details (Avatar, Title, Channel, Stats) */}
                        <div className="flex gap-3 px-1">
                            {/* Channel Avatar */}
                            <div className="shrink-0">
                                <img
                                    src={video.snippet.thumbnails.default?.url}
                                    alt={video.snippet.channelTitle}
                                    className="w-9 h-9 rounded-full object-cover border border-[#303030] hover:ring-2 hover:ring-white/10 transition-all"
                                    referrerPolicy="no-referrer"
                                />
                            </div>

                            {/* Text descriptions */}
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                                <h3 className="text-sm font-sans font-semibold text-[#f1f1f1] leading-snug line-clamp-2 group-hover:text-white transition-colors duration-200">
                                    {video.snippet.title}
                                    a.
                                </h3>

                                <div className="flex flex-col gap-0.5">
                                    {/* View */}
                                    <div className="flex items-center text-xs font-sans text-gray-400">
                                        {/* <span className="text-gray-400">view</span> */}
                                        {/* <span className="mx-1.5 text-[8px]">•</span> */}
                                        <span className="text-gray-400">{formatTimeAgo(video.snippet.publishedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}