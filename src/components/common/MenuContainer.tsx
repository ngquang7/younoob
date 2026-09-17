import React, { useEffect, useRef, useState } from 'react';
interface MenuContainerProps {
  onClose: () => void;
  children: React.ReactNode;
  className?: string; // Thêm prop này để nhận khoảng cách tùy chỉnh
}

export default function MenuContainer({ onClose, children, className = "mt-12 right-0" }: MenuContainerProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isDropUp, setIsDropUp] = useState(false);

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.bottom > windowHeight - 20) {
        setIsDropUp(true);
      }
    }
  }, []);
  
  return (
    <>
      <div
        className="fixed inset-0 z-40 cursor-default"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      <div
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
        className={`absolute w-64 bg-[#282828] text-white rounded-xl shadow-2xl py-2 z-50 text-sm border border-neutral-700 overflow-hidden 
        ${isDropUp ? 'bottom-full mb-2' : ''}  
        ${className}`}
      >
        {children}
      </div>
    </>
  );
}