import React from 'react';

interface SubscriptionItemProps {
    channel: any;
    onChannelClick: (id: string) => void;
    onUnsubscribeClick: (channel: any) => void;
    getSubscriberCount: (count: string) => string | undefined;
}

export default function SubscriptionItem({
    channel,
    onChannelClick,
    onUnsubscribeClick,
    getSubscriberCount
}: SubscriptionItemProps) {
    return (
        <div 
            onClick={() => onChannelClick(channel.id)}
            // bg-[#272727], co gi test cai khung bao quanh
            className="flex items-center justify-between py-2 mb-2 rounded-xl hover:cursor-pointer"
        >
            <div className="flex items-center ml-3 gap-3 overflow-hidden">
                <img
                    src={channel?.snippet?.thumbnails?.default?.url}
                    alt={channel?.snippet?.title}
                    className="w-35 h-35 rounded-full object-cover border border-[#303030]"
                />
                <div className="flex flex-col items-top">
                    <h1 className="text-xl text-white font-bold">
                        {channel?.snippet?.title}
                    </h1>
                    <p className="text-gray-400 text-xs mt-3">
                        <span>{channel?.snippet?.customUrl}</span> • {getSubscriberCount(channel?.statistics?.subscriberCount)} subscribers
                    </p>
                    <div className="text-gray-400 text-xs mt-0">
                        {channel?.brandingSettings?.channel?.description?.slice(0, 320)}
                    </div>
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onUnsubscribeClick(channel);
                }}
                className="bg-[#212121] hover:bg-[#303030] border border-[#404040] text-[#f1f1f1] ml-3 px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition active:scale-95"
            >
                Subscribed
            </button>
        </div>
    );
}