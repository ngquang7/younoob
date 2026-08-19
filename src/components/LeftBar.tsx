
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
interface SidebarProps {
  expanded: boolean;
  goHome: () => void;
  goHistory: () => void;

}
export default function LeftBar({expanded, goHome, goHistory}: SidebarProps){
  if (!expanded) {
    return (
      <aside className="fixed top-14 left-0 bottom-0 w-18 bg-neutral-1000 hidden sm:flex flex-col items-center py-2 gap-4 z-40 select-none border-r border-[#212121]/50">
          
            <button
              className=" flex items-center gap-5 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition cursor-pointer hover:bg-[#272727] text-gray-300 hover:text-white"
            >
                <img src="/public/home.png" className="h-8 w-8"/>
            </button>

            <button
              className=" flex items-center gap-5 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition cursor-pointer hover:bg-[#272727] text-gray-300 hover:text-white"
            >
                <img src="/public/subcribe.png" className="h-8 w-8"/>
            </button>

            <button
              className=" flex items-center gap-5 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition cursor-pointer hover:bg-[#272727] text-gray-300 hover:text-white"
            >
                <img src="/public/avatar.png" className="h-8 w-8"/>
            </button>
      </aside>
    );
  }
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  // Đọc danh sách kênh đã đăng ký từ localStorage khi Sidebar được bật lên
  useEffect(() => {
    const savedSubs = JSON.parse(localStorage.getItem('subscribed_channels') || '[]');
    setSubscriptions(savedSubs);
  }, []);
    return(
      <aside className="fixed top-14 left-0 bottom-0 w-60 bg-neutral-1000 p-3 hidden sm:flex flex-col gap-4 overflow-y-auto z-40 select-none border-r border-[#212121]/50 text-[#f1f1f1]">         
      {/* Main Section */}
        <div className="flex flex-col gap-0.5 border-b border-[#212121] pb-3">
            {/* Home button */}
              <button
                className={`w-full flex items-center gap-5 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition cursor-pointer hover:bg-[#272727] text-gray-300 hover:text-white`}
                //Never put goHome button in div, put it in button card
                onClick={goHome}
                title="Home"
              >
                <img src="/public/home.png" className="h-8 w-8"/>
                <div
                  className="ml--30 text-base">
                    Home
                </div>
              </button>
        </div>
      {/* Subcription button */}
        <div className="flex flex-col gap-0.5 border-b border-[#212121] pb-3">
              <button className="flex flex items-left px-4 py-1.5 text-xxl font-sans font-semibold uppercase tracking-wider text-gray-500 transition cursor-pointer hover:bg-[#272727] text-gray-300 hover:text-white">
                Subcriptions &gt;
              </button>
        {subscriptions.length === 0 ? (
          <p className="px-3 text-xs text-gray-500 italic">No subscriptions yet</p>
        ) : (
          subscriptions.map((channel) => (
            <div 
              key={channel.id}
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#272727] cursor-pointer transition group"
            >
              {/* Ảnh đại diện + Tên kênh */}
              <div className="flex items-center gap-3 overflow-hidden">
                <img 
                  src={channel.thumbnail} 
                  alt={channel.title} 
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <span className="text-sm truncate text-gray-200 group-hover:text-white">
                  {channel.title}
                </span>
              </div>
            </div>
          ))
        )}
        </div>

      {/* YOU button */}
        <div className="flex flex-col gap-0.5 ">
              <button className="flex flex items-left px-4 py-1.5 text-xxl font-sans font-semibold uppercase tracking-wider text-gray-500 transition cursor-pointer hover:bg-[#272727] text-gray-300 hover:text-white">
                you &gt;
              </button>
          {/* History button */}
              <button
              className={`w-full flex items-center gap-5 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition cursor-pointer hover:bg-[#272727] text-gray-300 hover:text-white`}
              title="History"
              onClick={goHistory}
            >
              <img src="/public/history.png" className="h-8 w-8"/>
              <div className="ml--30 text-base">History</div>
            </button>

              <button
                className={`w-full flex items-center gap-5 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition cursor-pointer hover:bg-[#272727] text-gray-300 hover:text-white`}
                title="Subcription"
              >
                <img src="/public/subcribe.png" className="h-8 w-8"/>
                <div className="ml--30 text-base">Subcription</div>
              </button>

        </div>
    </aside>
    );
}