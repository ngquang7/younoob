
export default function LeftBar(){


    return(
    <aside className="fixed top-14 left-0 bottom-0 w-60 bg- p-3 hidden sm:flex flex-col gap-4 overflow-y-auto z-40 select-none border-r border-[#212121]/50 text-[#f1f1f1]">
          {/* Main Section */}
      <div className="flex flex-col gap-0.5 border-b border-[#212121] pb-3">

            <button

              className={`w-full flex items-center gap-5 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition cursor-pointer `}
            >

            </button>
        
        
      </div>
    
    
    
    </aside>
    );
}