import React from 'react';

interface LogoProps {
  className?: string;
  color?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", color = "currentColor", size = 48 }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transform -skew-x-12 transition-transform duration-300 group-hover:scale-110"
      >
        {/* Aerodynamic Background Delta Shape */}
        <path 
          d="M10 85L50 15L90 85H10Z" 
          fill={color} 
          className="opacity-10"
        />
        
        {/* Main Stylized 'D' and 'V' Monogram */}
        <path 
          d="M15 80L45 25V80H15Z" 
          fill={color} 
        />
        <path 
          d="M55 25L85 80H70L55 50L40 80H25L55 25Z" 
          fill={color} 
        />
        
        {/* Speed Line Accents */}
        <rect x="15" y="85" width="30" height="3" fill={color} />
        <rect x="55" y="85" width="20" height="3" fill={color} opacity="0.6" />
        <rect x="80" y="85" width="5" height="3" fill={color} opacity="0.3" />
      </svg>
    </div>
  );
};

export default Logo;