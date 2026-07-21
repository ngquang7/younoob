

export default function () {


    return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-[#0f0f0f] flex items-center justify-between px-4 z-50 select-none border-b border-[#212121]">
      {/* Left Area: Hamburger & Logo */}
      <div className="flex items-center gap-4">
        <button
        //   onClick={onToggleSidebar}
          id="nav-toggle-btn"
          className="p-2 hover:bg-[#212121] rounded-full active:scale-95 transition cursor-pointer text-[#f1f1f1]"
        >
            <img src="/public/sidebar.png" alt="sidebar" className="w-6 h-6" />
          {/* <Menu className="w-5 h-5" /> */}
        </button>
        
        <div 
        //   onClick={onHomeClick}
          id="nav-logo"
          className="flex items-center gap-1.5 cursor-pointer active:scale-98 transition group"
        >
          {/* Custom YouTube Red Icon SVG */}
          <span className="text-[#f1f1f1] font-sans font-bold text-lg tracking-tighter flex items-center gap-1">
            <img src="/public/logo-white.png" alt='Loogo' className="w-30 h-8"/>
          </span>
        </div>
      </div>



    </nav>
    );
}