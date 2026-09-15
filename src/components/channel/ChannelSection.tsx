import { useState } from "react";
import { formatSubcriberCount } from "../../utils/formatSubcriberCount";
import { formatDateTime } from "../../utils/formatDateTime";
import {formatNumberUsStyle} from "../../utils/formatNumberUsStyle";
interface ChannelSectionProps {
    channel: any;
    isSubscribed?: boolean;
    handleSubscribeToggle?: () => void;
}

export default function ChannelSection({
    channel,
    isSubscribed = false,
    handleSubscribeToggle = () => { }
}: ChannelSectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalUnsubscribe, setModalUnsubscribe] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const channelData = channel?.[0];
    if (!channelData) return null;

    const avatarUrl = channelData?.snippet?.thumbnails?.medium?.url;
    const title = channelData?.snippet?.title;
    const customUrl = channelData?.snippet?.customUrl;
    const description = channelData?.brandingSettings?.channel?.description || channelData?.snippet?.description || "";
    const descriptionSnippet = description.slice(0, 20);
    const subscriberCount = channelData?.statistics?.subscriberCount;
    const videoCount = channelData?.statistics?.videoCount;
    const viewCount = channelData?.statistics?.viewCount;
    const publishedAt = channelData?.snippet?.publishedAt;
    const country = channelData?.snippet.country;
    console.log(`${country}`);

    return (
        <div className="flex gap-4 mt-10 items-start relative">
            {/* Avatar & Phóng to ảnh */}
            {avatarUrl && (
                <img
                    src={avatarUrl}
                    alt="Channel Avatar"
                    onClick={() => setPreviewImage(avatarUrl)}
                    className="w-40 h-40 cursor-pointer rounded-full object-cover border border-[#303030]"
                />
            )}

            {/* Thông tin kênh: Title, Username, Description, Subscribe Button */}
            <div className="flex flex-col items-top flex-1">
                <h1 className="text-4xl font-bold text-white">{title}</h1>
                <p className="text-gray-400 text-sm mt-3">
                    <span className="font-bold text-white">{customUrl}</span> •{" "}
                    {formatSubcriberCount(subscriberCount)} subscribers • {videoCount} videos
                </p>

                {/* Description ngắn + Modal ...more */}
                <div
                    className="flex items-center gap-3 text-l text-gray-200 mb-1 cursor-pointer w-fit"
                    onClick={() => setIsModalOpen(true)}
                >
                    <button className="text-gray-400 text-sm mt-3 items-start cursor-pointer">
                        {description ? (<><span className="text-gray-400 text-sm mt-3">{descriptionSnippet}</span><span className="font-semibold text-l text-white">...more</span></>) : (<><span className="text-gray-400 text-sm mt-3">More about this channle </span><span className="font-semibold text-l text-white">...more</span></>)} 
                    </button>
                </div>

                {/* Nút Subscribe */}
                <button
                    onClick={() => {
                        if (!isSubscribed) {
                            handleSubscribeToggle();
                        } else {
                            setModalUnsubscribe(true);
                        }
                    }}
                    className={`-ml-2 py-2 text-sm font-semibold w-30 mt-3 rounded-full cursor-pointer transition active:scale-95 ${isSubscribed
                        ? "bg-[#212121] hover:bg-[#303030] border border-[#404040] text-[#f1f1f1]"
                        : "bg-white hover:bg-gray-200 text-black"
                        }`}
                >
                    {isSubscribed ? (
                        <div className="flex items-center justify-center">
                            <img src="/public/tick.png" className="h-3 w-3 ml-1" alt="tick" />
                            <span className="ml-1">Subscribed</span>
                        </div>
                    ) : (
                        "Subscribe"
                    )}
                </button>
            </div>

            {modalUnsubscribe && (
                <div
                    onClick={() => setModalUnsubscribe(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#212121] flex flex-col text-white max-w-[80vh] items-center rounded-2xl p-6 shadow-2xl relative"
                    >
                        <div className="text-gray-400 text-lg">
                            Unsubscribe from <span className="text-white font-bold">{title}</span>?
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                            <button
                                onClick={() => setModalUnsubscribe(false)}
                                className="px-4 py-2 hover:bg-[#303030] text-white text-sm font-semibold rounded-full transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleSubscribeToggle();
                                    setModalUnsubscribe(false);
                                }}
                                className="px-4 py-2 hover:bg-[#303030] text-blue-500 text-sm font-semibold rounded-full transition cursor-pointer"
                            >
                                Unsubscribe
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Xem ảnh Avatar lớn */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setPreviewImage(null)}
                >
                    <img
                        src={previewImage}
                        alt="Preview Large"
                        className="w-120 h-120 rounded-full object-cover shadow-lg border-4 border-gray-600"
                    />
                </div>
            )}

            {/* Modal Description & More Info */}
            {isModalOpen && (
                <div
                    onClick={() => setIsModalOpen(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#212121] text-white w-[600px] max-h-[80vh] overflow-y-auto rounded-2xl p-6 shadow-2xl relative border border-gray-700 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#555] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
                    >
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl p-2 rounded-full cursor-pointer hover:bg-gray-700 transition"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-bold mb-6">{title}</h2>

                        <div className="mb-6">
                            <h3 className="font-bold text-xl mb-2">{description ? "Description" : ""}</h3>
                            <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                                {description}
                            </p>
                        </div>

                        <div className="border-t border-gray-700 pt-4 space-y-3 text-sm text-gray-300">
                            <h3 className="font-bold text-xl mb-2 text-white">More info</h3>
                            <div className="flex items-center gap-3">
                                <span>
                                    <img src="/public/youtubelogoDes.png" className="h-6 w-7" alt="logo" />
                                </span>
                                <a
                                    href={`https://www.youtube.com/${customUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="-mt-1"
                                >
                                    www.youtube.com/{customUrl}
                                </a>
                            </div>

                            <div className="flex items-center gap-3">
                                <img src="/public/iDes.png" className="h-7 w-7" alt="logo" />
                                <span>Joined {publishedAt ? formatDateTime(publishedAt) : ""}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <img src="/public/subscribersDes.png" className="h-7 w-7" alt="logo" />
                                <span>{formatSubcriberCount(subscriberCount)} subscribers</span>
                            </div>

                            {videoCount > 0 ? (
                            <div className="flex items-center gap-3">
                                <img src="/public/videoDes.png" className="h-6 w-7" alt="logo" />
                                <span>{videoCount} videos</span>
                            </div>
                            ) : (<></>)}

                            {viewCount > 0 ? (
                            <div className="flex items-center gap-3">
                                <img src="/public/viewDes.png" className="h-6 w-7" alt="logo" />
                                <span>{formatNumberUsStyle(viewCount)} views</span>
                            </div>) : (<></>)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}