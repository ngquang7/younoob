import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChannelData } from '../api/channelData';

export default function SubcriptionChannel () {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const goChannel = (chanelId: string) => navigate(`/channel/${chanelId}`);
    const goSubcriptionChannel = () => navigate(`/feed/channels`);
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(true);
    const [selectedChannel, setSelectedChannel] = useState<any | null>(null);


    useEffect(() => {
        const fetchSubscriptionDetails = async () => {
            try{
                const savedSubs = JSON.parse(localStorage.getItem('subscribed_channels') || '[]');
                setSubscriptions(savedSubs);
                if (savedSubs.length === 0) {
                    setSubscriptions([]);
                    setLoading(false);
                    return;
                }
                const channelIds = savedSubs.map((sub: any) => (typeof sub === 'string' ? sub : sub.id)).join(',');
                const response = await getChannelData(channelIds);
                if (response && response.items) {
                    setSubscriptions(response.items);
                }
            } catch (error) {
                console.error("Loi khi tai thong tin dang ki", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptionDetails();
    }, []);

    const handleUnsubscribe = (channelToUnsub: any) => {
        const savedSubs = JSON.parse(localStorage.getItem('subscribed_channels') || '[]');
        
        // Lọc bỏ channel bị hủy khỏi danh sách lưu trữ
        const updatedSubs = savedSubs.filter((sub: any) => {
            const subId = typeof sub === 'string' ? sub : sub.id;
            return subId !== channelToUnsub.id;
        });

        // Update localStorage again
        localStorage.setItem('subscribed_channels', JSON.stringify(updatedSubs));

        // Cập nhật lại state giao diện để mất kênh này đi ngay lập tức
        setSubscriptions(prev => prev.filter(ch => ch.id !== channelToUnsub.id));
        
        // Đóng modal
        setSelectedChannel(null);
    };
    if (loading) return <div className="px-10 py-10 text-white">Loading...</div>;

    return(
        <div className="mx-auto px-10 py-2 text-white min-h-screen">
            <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-bold font-sans mt-3 ml-3 mb-3">All Subcriptions</h1>
                {/* CHANNELs THAT ARE SUBCRIBED */}
                {subscriptions.length === 0 ? (
                    <p className="px-3 text-xs text-gray-500 italic">No subscriptions yet</p>
                    ) : (
                    subscriptions.map((channel) => (
                        <div onClick={() => goChannel(channel.id)}
                            key={channel.id}
                            // bg-[#272727], co gi test cai khung bao quanh
                            className="flex items-center justify-between py-2 mb-2 rounded-xl hover: cursor-pointer"
                        >
                            {/* Avatar + channel name */}
                            <div className="flex items-center ml-3 gap-3 overflow-hidden">
                            <img 
                                src={channel?.snippet?.thumbnails?.default?.url} 
                                className="w-35 h-35 rounded-full object-cover border border-[#303030]" 
                            />
                                {/* Subcriber + customUrl + description*/}
                                <div className="flex flex-col items-top">
                                    <h1 className="text-xl text-white bold 700">
                                        {channel?.snippet?.title}
                                        {/* {channel.id} */}
                                    </h1>
                                    <p className="text-gray-400 text-xs mt-3">
                                        <span>{channel?.snippet?.customUrl}</span> • {channel?.statistics?.subscriberCount || 0} subcribers
                                    </p>
                                    <div className="text-gray-400 text-xs mt-0">
                                        {channel?.brandingSettings?.channel?.description.slice(0,320)}
                                    </div>
                                </div>

                                {/* Subcribe button */}
                                <button
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedChannel(channel);
                                    }}
                                    className={`bg-[#212121] hover:bg-[#303030] border border-[#404040] text-[#f1f1f1] gap-1 ml-3 px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition active:scale-95
                                    ${isSubscribed 
                                    ? 'bg-[#212121] hover:bg-[#303030] border border-[#404040] text-[#f1f1f1]' 
                                    : 'bg-white hover:bg-gray-200 text-black'
                                    }`}
                                >
                                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                                </button>
                            </div>                        
                        </div>
                    ))
                )}
                {/* Table unsubcribe or cancle unsubcribe */}
                {selectedChannel && (
                    <div 
                        onClick={() => setSelectedChannel(null)}                                
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]"
                    >
                        {/* Size of padding */}
                        <div onClick={(e) => e.stopPropagation()} 
                            className="bg-[#212121] flex-col text-white max-w-[80vh] max-h-[80vh] flex items-center rounded-2xl p-6 shadow-2xl relative [scrollbar-width:none]"
                        >
                            {/* Title: Unsubribe from {channel name} */}
                            <div className="text-gray-400 text-l">
                                Unsubscribe from <span className="text-white font-bold" >{selectedChannel?.snippet?.title || "..."}</span> ?
                            </div>
                            {/* 2 buttons: Cancle and Unsubcribe */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedChannel(null)}                                
                                    className="px-4 py-2 mt-5 ml-15 flex hover:bg-[#303030] text-white text-sm font-semibold rounded-full transition cursor-pointer"
                                >
                                    Cancle                                
                                </button>
                                <button
                                    className="px-4 py-2 mt-5 flex items-end hover:bg-[#303030] text-blue-500 text-sm font-semibold rounded-full transition cursor-pointer"
                                    onClick={() => handleUnsubscribe(selectedChannel)}
                                    >
                                    Unsubribe                     
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}