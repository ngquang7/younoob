// src/context/SidebarContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
  sidebarExpanded: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Tự động đóng sidebar nếu màn hình nhỏ hơn 768px khi load trang
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarExpanded(false);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ sidebarExpanded, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook để sử dụng nhanh ở bất kỳ component nào
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar phải được sử dụng bên trong SidebarProvider');
  }
  return context;
};