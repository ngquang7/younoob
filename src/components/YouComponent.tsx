import { useNavigate, useParams } from 'react-router-dom';
import {useState, useEffect, useRef} from 'react';


export default function YouComponent () {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const [historyList, setHistoryList] = useState<any[]>([]);
    const [isHovered, setIsHovered] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const goChannel = (channelId: string) => navigate(`/channel/${channelId}`);


    const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
            setIsHovered(true);
        }, 1100);
    };

  const handleMouseLeave = () => {
    if (timerRef.current) {
            clearTimeout(timerRef.current); // Hủy đếm giờ nếu rời chuột trước 3s
        }
    setIsHovered(false);
    };

    useEffect(() => {
    //Get string string
    const savedHistory = JSON.parse(localStorage.getItem('watch_history') || '[]');
    setHistoryList(savedHistory);
    }, []);

    const getView = (view: string) => {
    const totalView: number = Number(view);
    if(totalView < 1000) return `${view}`;
    if(totalView < 1000000) return `${Math.floor(totalView/1000)}K`; //  K views
    if(totalView < 1000000000) return `${Math.floor(totalView/1000000)}M`; // M views
    if(totalView < 1000000000000) return `${Math.floor(totalView/1000000000)}B`; // B views
    }

    const getTimeago = (date: string) => {
        const videoDate = new Date(date);
        const currentTime = new Date();
        const timeAgo = Math.floor((currentTime.getTime() - videoDate.getTime()) / 1000);
        if(timeAgo < 60) return `${timeAgo} seconds ago`; //SECOND
        if (timeAgo < 3600) { // MINUTE
        const minutes = Math.floor(timeAgo / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } 
        if (timeAgo < 86400) { // HOUR
        const hours = Math.floor(timeAgo/3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } 
        if (timeAgo < 604800) { // DAY
        const days = Math.floor(timeAgo / 86400);
        return `${days} day${days > 1 ? 's' : '' } ago`;
        } 
        if (timeAgo < 2592000) { // WEEK
        const weeks = Math.floor(timeAgo / 604800);
        return `${weeks} week${weeks > 1 ? 's' : '' } ago`;
        } 
        if (timeAgo < 31536000) { // MONTH
        const months = Math.floor(timeAgo / 2592000);
        return `${months} month${months > 1 ? 's' : '' } ago`;
        }  
        //YEAR
        const years = Math.floor(timeAgo / 31536000);
        return `${years} year${years > 1 ? 's' : '' } ago`;
    }
    return(
        <div className="ml-6 mt-1 flex mr-10 flex-col border-gray-600">
            {/* Profile */}
            <div className="flex items-start gap-3">
                <img
                src="/public/Q.png"
                    className="w-35 h-35 rounded-full object-cover border border-[#303030]" 
                />
                

                <div
                    className="flex flex-col items-top"
                >
                    <h1 className="text-4xl font-bold text-white">
                        ngquang7
                    </h1>
                    <p className="text-gray-400 text-sm mt-3">
                        <span className="font-bold text-white   ">@ngquang</span> • View channel
                    </p>
                    {/* whitespace-pre-wrap" */}
                    <div 
                        className="flex items-center gap-3 text-l text-gray-200 mb-1 cursor-pointer w-fit"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <button className="text-gray-400 text-sm mt-3 items-start cursor-pointer">
                            toi laquang <span className="font-semibold text-l text-white">...more</span>
                        </button>
                    </div>     
                </div>
            </div>

                {/* History */}
                <div className="ml-6 mt-1 flex mr-10 flex-col border-gray-600">
                    <div className="text-xl font-bold text-white mt-8 mb-5">
                        History
                    </div>

                    {/* Video History */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {historyList.slice(0, 4).map((video) => (
                        <div 
                            key={video.id} 
                            onClick={() => navigate(`/watch?v=${video.id}`)}
                            className="hover:bg-[#272727] rounded-[10px] cursor-pointer"
                        >
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#212121]">
                                <img
                                    src={video.snippet.thumbnails.medium?.url}
                                    // alt={video.snippet.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Details (Avatar, Title, Channel, Stats) PART */}
                            <div className="flex gap-3 px-1">
                                {/* Channel Avatar */}
                                <div className="shrink-0">
                                    <img
                                        src={video.snippet.thumbnails.default?.url}
                                        className="w-9 h-9 rounded-full object-cover border border-[#303030] hover:ring-2 hover:ring-white/10 transition-all"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>

                                {/* Title video */}
                                <div className="flex flex-col gap-1 flex-1 min-w-0">
                                    <h3 className="text-sm font-sans font-semibold text-[#f1f1f1] leading-snug line-clamp-2 group-hover:text-white transition-colors duration-200">
                                        {video.snippet.title}
                                    </h3>
                                
                                    <div className="flex flex-col gap-0.5">
                                        <span 
                                        onClick={(e) => {
                                                e.stopPropagation();
                                                goChannel(video.snippet.channelId);
                                            }}
                                            className="text-xs font-sans text-gray-400 hover:text-[#f1f1f1] transition-colors truncate"
                                        >
                                            {video.snippet.channelTitle}
                                        </span>
                                            {/* View */}
                                        <div className="flex items-center text-xs font-sans text-gray-400">
                                            <span className="text-gray-400">view</span>
                                            <span className="mx-1.5 text-[8px]">•</span>
                                            <span className="text-gray-400">{getTimeago(video.snippet.publishedAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> 
            </div>
        </div>
    );
}