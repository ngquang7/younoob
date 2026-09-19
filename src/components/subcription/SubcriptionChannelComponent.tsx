import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChannelData } from '../../api/channelData';
import { storageService } from '../../hooks/storageService';
import SubscriptionItem from './SubcriptionItem';
import UnsubscribeModal from '../common/UnsubcribeModal';
export default function SubcriptionChannel() {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const goChannel = (chanelId: string) => navigate(`/channel/${chanelId}`);
    const [loading, setLoading] = useState(true);
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

    const handleUnsubscribe = (channelId: any) => {
        storageService.toggleSubscribe(channelId);
        setSubscriptions(prev => prev.filter(ch => ch.id !== channelId.id)); //update currrent state, UI, updating immediatetly
        setSelectedChannel(null);
    };

    return (
        <div className="mx-auto px-50 py-2 text-white min-h-screen">
            <div className="flex flex-col gap-3">
                <h1 className="text-4xl font-bold font-sans mt-3 ml-3 mb-3">All Subcriptions</h1>
                {/* CHANNELS THAT ARE SUBCRIBED */}
                {subscriptions.length === 0 ? (
                    <p className="px-3 text-xs text-gray-500 italic">No subscriptions yet</p>
                ) : (
                    subscriptions.map((channel) => (
                        <SubscriptionItem
                            key={channel.id}
                            channel={channel}
                            onChannelClick={goChannel}
                            onUnsubscribeClick={(ch) => setSelectedChannel(ch)}            
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