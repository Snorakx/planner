import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "./Header";

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.includes(path.substring(1))) return true;
    return false;
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrollingDown = prevScrollPos < currentScrollPos;
      const isScrollingUp = prevScrollPos > currentScrollPos;
      
      // If scrolling down and not at the top, hide navigation
      if (isScrollingDown && currentScrollPos > 10) {
        setIsVisible(false);
      } 
      // If scrolling up or at the top, show navigation
      else if (isScrollingUp || currentScrollPos < 10) {
        setIsVisible(true);
      }
      
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);

  const navigationItems = [
    {
      name: "Planner",
      path: "/",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
    },
    {
      name: "Daily",
      path: "/daily",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
    },
    {
      name: "Pomodoro",
      path: "/pomodoro",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
    },
    {
      name: "Progress",
      path: "/progress",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ),
    },
  ];

  return (
    <>
      <Header />
      
      {/* Desktop Navigation - Horizontal Menu */}
      <div className="hidden md:flex justify-center py-2 bg-white/80 dark:bg-black/10 backdrop-blur-md border-b border-gray-200/20 dark:border-white/10">
        <div className="flex gap-1 bg-white/10 dark:bg-white/5 p-1 rounded-full">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                closeMenu();
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive(item.path)
                  ? "bg-white text-black dark:bg-white dark:text-black"
                  : "text-gray-700 dark:text-white/60 hover:bg-white/10"
              }`}
            >
              <span className="hidden sm:block">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Mobile Bottom Tab Bar */}
      <div 
        className={`md:hidden fixed bottom-0 inset-x-0 bg-white/80 dark:bg-black/50 backdrop-blur-lg border-t border-gray-200/20 dark:border-white/10 flex justify-around items-center h-16 z-50 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {navigationItems.map((item) => (
          <button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              closeMenu();
            }}
            className={`flex flex-col items-center justify-center px-3 py-2 rounded-full ${
              isActive(item.path)
                ? "text-primary dark:text-primary"
                : "text-gray-700 dark:text-white/50 hover:text-primary dark:hover:text-primary"
            }`}
          >
            <div className="mb-1">
              {item.icon}
            </div>
            <span className="text-xs font-medium">{item.name}</span>
          </button>
        ))}
      </div>
    </>
  );
}; 