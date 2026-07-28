

interface SidebarProps {
  expanded: boolean;
  goHome: () => void;

}
export default function LeftBar({expanded, goHome}: SidebarProps){

  if (!expanded) {
    return (
      <aside className="fixed top-14 left-0 bottom-0 w-18 bg-gray-700 hidden sm:flex flex-col items-center py-2 gap-4 z-40 select-none border-r border-[#212121]/50">
          
            <button
              className={`w-14 h-14 flex flex-col items-center justify-center gap-1 rounded-xl transition cursor-pointer text-[#f1f1f1] 'hover:bg-[#272727] text-gray-400 hover:text-white'}`}
            >
              <span className="text-[10px] tracking-tight font-sans text-center"></span>
            </button>
          
      </aside>
    );
  }
    return(
      <aside className="fixed top-14 left-0 bottom-0 w-60 bg-gray-700 p-3 hidden sm:flex flex-col gap-4 overflow-y-auto z-40 select-none border-r border-[#212121]/50 text-[#f1f1f1]">         
      {/* Main Section */}
        <div className="flex flex-col gap-0.5 border-b border-[#212121] pb-3">
            {/* Home button */}
              <button
                className={`w-full flex items-center gap-5 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition cursor-pointer hover:bg-[#272727] text-gray-300 hover:text-white`}
              >
                <img src="/public/home.png" className="h-8 w-8"/>
                <div 
                  onClick={goHome} 
                  className="ml--30 text-base"
                  title="Home">
                    Home
                </div>
              </button>
            {/* Subcription button */}
              <button
                className={`w-full flex items-center gap-5 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition cursor-pointer hover:bg-[#272727] text-gray-300 hover:text-white`}
              >
                <img src="/public/subcribe.png" className="h-8 w-8"/>
                <div className="ml--30 text-base">Subcription</div>
              </button>
        </div>
    
    
    
    </aside>
    );
}