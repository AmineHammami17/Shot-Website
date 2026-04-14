import { useState } from 'react';
import { Link } from 'react-router-dom';

const PasswordChanged = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBackHomeHovered, setIsBackHomeHovered] = useState(false); // État pour le bouton Back

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-6 font-montserrat bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/Sign Up.png')" }}
    >
      {/* --- Bouton Back to Home --- */}
      <div className="absolute top-8 left-8">
        <Link 
          to="/home"
          onMouseEnter={() => setIsBackHomeHovered(true)}
          onMouseLeave={() => setIsBackHomeHovered(false)}
          className={`
            flex items-center bg-[#29ac96] text-white shadow-lg 
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden
            ${isBackHomeHovered ? 'w-[200px] h-12 rounded-full px-4' : 'w-12 h-12 rounded-2xl justify-center'}
          `}
        >
          <div className="relative w-8 h-6 shrink-0 flex items-center justify-center">
            {/* Barre + Flèche */}
            <div className={`absolute flex items-center transition-all duration-500 ease-out ${isBackHomeHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="w-[2px] h-4 bg-white rounded-full mr-[2px]"></div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </div>

            {/* Icône Maison */}
            <div className={`absolute transition-all duration-500 ease-in ${isBackHomeHovered ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625A1.875 1.875 0 013.75 19.875v-6.198c.03-.028.06-.056.091-.086L12 5.432z" />
              </svg>
            </div>
          </div>
          <div className={`transition-all duration-500 overflow-hidden ${isBackHomeHovered ? 'max-w-[140px] ml-4 opacity-100' : 'max-w-0 opacity-0 ml-0'}`}>
            <span className="font-bold whitespace-nowrap text-base">Back to Home</span>
          </div>
        </Link>
      </div>

      <div className="w-full max-w-[500px] bg-white rounded-[40px] p-10 shadow-sm flex flex-col items-center border border-gray-100 text-center">
        {/* Logo */}
        <div className="mb-12 h-7">
          <img src="/images/logo_SHOT.png" alt="S.HOT Logo" className="h-full w-auto" />
        </div>

        {/* Success Icon */}
        <div className="mb-8 w-24 h-24 rounded-full border-[4px] border-[#0a9382] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#0a9382" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Changed !</h1>
        <p className="text-gray-500 text-sm mb-12">Your password has been changed successfully</p>

        {/* Bouton Back to Login */}
        <Link to="/login" className="w-full">
          <button 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full bg-[#238d7b] hover:bg-[#1db096] text-white font-bold py-4 rounded-3xl shadow-lg transition-all flex items-center justify-center gap-1 relative overflow-hidden"
          >
            <span className={`transition-all duration-300 ${isHovered ? '-translate-x-1' : 'translate-x-0'}`}>
              Back to Login
            </span>
            
            <div className={`flex items-center transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0.5' : 'opacity-0 -translate-x-1'}`}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2.5} 
                stroke="currentColor" 
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              <span className="h-5 w-[2px] bg-white rounded-full ml-0.5 inline-block"></span>
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PasswordChanged;