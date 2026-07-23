import {useState } from 'react'
interface HeaderProps {
  onToggleSidebar: () => void;
  onCustomClick: (message :string ) => void;
}
export default function Header ( {  onToggleSidebar, onCustomClick}: HeaderProps ) {
  const [searchText, setSearchText] = useState('');

  const handleChange =  (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
  }

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault(); // Ngăn trang refresh lại
    if (searchText.trim()) {
      onCustomClick(searchText); // Truyền giá trị searchText ra ngoài
    }
  };

    return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-[#0f0f0f] flex items-center justify-between px-4 z-50 select-none border-b border-[#212121]">
      {/* Left Area: SidebarButton & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          id="nav-toggle-btn"
          className="p-2 hover:bg-[#212121] rounded-full active:scale-95 transition cursor-pointer text-[#f1f1f1]"
        >
            <img src="/public/sidebar.png" className="w-6 h-6" />
        </button>
        
        <div 
          id="nav-logo"
          className="flex items-center gap-1.5 cursor-pointer active:scale-98 transition group"
        >
          {/* Custom YouTube Red Icon SVG */}
          <span className="text-[#f1f1f1] font-sans font-bold text-lg tracking-tighter flex items-center gap-1">
            <img src="/public/logo-white.png" className="w-30 h-8"/>
          </span>
        </div>
      </div>

  { /* Search bar */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-4 hidden md:flex items-center ml-50" >
        <div className="flex flex-1 items-center bg-[#121212] border border-[#303030] rounded-l-full px-4 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <input
            onChange={handleChange}
            value={searchText}
            type="text"
            placeholder="Search"  
            className="w-full bg-transparent text-[#f1f1f1] placeholder-gray-500 text-sm focus:outline-none"
          />
        </div>

        <button
          onClick={() => onCustomClick(searchText)} 
          type="submit"
          className="bg-[#222222] border-y border-r border-[#303030] hover:bg-[#303030] h-9 px-6 py-2.5 rounded-r-full flex items-center justify-center cursor-pointer transition text-[#f1f1f1] active:bg-[#404040]"
        >
        </button>
      </form>

    </nav>
    );
}