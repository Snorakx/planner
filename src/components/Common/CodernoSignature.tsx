import React, { useState, useEffect } from 'react';

export const CodernoSignature: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Fade in after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    window.open('https://coderno.pl', '_blank', 'noopener,noreferrer');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 md:right-20 z-50">
      <div 
        className="group relative animate-fadeIn"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          onClick={handleClick}
          onKeyDown={handleKeyPress}
          className="
            backdrop-blur-md bg-gradient-to-r from-indigo-600/95 to-purple-600/95 
            dark:from-indigo-500/90 dark:to-purple-500/90
            text-white text-sm font-montserrat
            px-5 py-3 rounded-2xl
            opacity-90 hover:opacity-100
            transition-all duration-300 ease-out
            hover:translate-y-[-3px] hover:shadow-xl hover:shadow-indigo-500/25
            hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
            ios-button border border-white/20
            flex items-center gap-2
          "
          aria-label="Made by Coderno - Visit our website"
          tabIndex={0}
        >
          {/* Logo/Icon */}
          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="flex items-center gap-1">
            Made by <span className="font-bold text-base">Coderno</span>
          </span>
        </button>
        
        {/* Tooltip */}
        {showTooltip && (
          <div 
            className="
              absolute bottom-full right-0 mb-3 
              backdrop-blur-md bg-gradient-to-r from-indigo-600/95 to-purple-600/95
              dark:from-indigo-500/95 dark:to-purple-500/95
              text-white text-sm font-montserrat font-medium
              px-4 py-3 rounded-xl
              whitespace-nowrap
              animate-fadeIn
              shadow-xl shadow-indigo-500/25
              border border-white/20
            "
            role="tooltip"
          >
            ✨ We build micro-tools that simply work.
            <div className="
              absolute top-full right-4 
              w-0 h-0 
              border-l-4 border-r-4 border-t-4 
              border-l-transparent border-r-transparent 
              border-t-indigo-600/95 dark:border-t-indigo-500/95
            "></div>
          </div>
        )}
      </div>
    </div>
  );
}; 