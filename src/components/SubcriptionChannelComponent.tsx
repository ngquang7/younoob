import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChannelData } from '../api/channelData';
import { formatSubcriberCount } from '../utils/formatSubcriberCount';
import SubscriptionItem from './SubcriptionItem';
import UnsubscribeModal from './UnsubcribeModal';
export default function SubcriptionChannel() {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const goChannel = (chanelId: string) => navigate(`/channel/${chanelId}`);
    const goSubcriptionChannel = () => navigate(`/feed/channels`);
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(true);
    const [selectedChannel, setSelectedChannel] = useState<any | null>(null);
    
    useEffect(() => {
        const fetchSubscriptionDetails = async () => {
            try {
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

    return (
        <div className="mx-auto px-10 py-2 text-white min-h-screen">
            <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-bold font-sans mt-3 ml-3 mb-3">All Subcriptions</h1>
                {/* CHANNELs THAT ARE SUBCRIBED */}
                {subscriptions.length === 0 ? (
                    <p className="px-3 text-xs text-gray-500 italic">No subscriptions yet</p>
                ) : (
                    subscriptions.map((channel) => (
                        <SubscriptionItem
                            key={channel.id}
                            channel={channel}
                            onChannelClick={goChannel}
                            onUnsubscribeClick={(ch) => setSelectedChannel(ch)}
                            getSubscriberCount={formatSubcriberCount}
                        />
                    ))
                )}
                <UnsubscribeModal
                    channel={selectedChannel}
                    onClose={() => setSelectedChannel(null)}
                    onConfirm={() => handleUnsubscribe(selectedChannel)}
                />
            </div>
        </div>
    );
}