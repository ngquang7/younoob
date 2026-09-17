import React from 'react';
import { useRef, useState, useEffect } from 'react';
interface SaveToPlaylistModalProps {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function SaveToPlaylistModal({ onClose, children, className = "mt-12" }: SaveToPlaylistModalProps) {
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
        className={`overflow-hidden absolute w-[400px] cursor-default bg-[#282828] text-white rounded-xl shadow-2xl py-2 z-50 text-sm 
        ${className}
        ${isDropUp ? 'bottom-full mb-2' : ''}
        `}
      >
        <div className="px-4 py-2 text-[17px] font-bold mb-4">Save to...</div>
        {children}
      </div>
    </>
  );
}