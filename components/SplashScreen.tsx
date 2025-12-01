import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onFinish, 500); // Wait for fade out
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary-700 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white p-6 rounded-full shadow-xl mb-6 animate-bounce">
         {/* Placeholder for IITGN Logo */}
         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
         </svg>
      </div>
      <h1 className="text-3xl font-bold text-white tracking-wide">IITGN</h1>
      <p className="text-primary-200 mt-2 text-sm tracking-widest uppercase">Companion</p>
    </div>
  );
};

export default SplashScreen;
