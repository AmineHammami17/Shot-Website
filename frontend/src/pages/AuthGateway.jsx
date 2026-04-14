import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';

const AuthGateway = () => {
  const { t } = useTranslation();
  const [isBackHovered, setIsBackHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/home";

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-6 font-montserrat bg-cover bg-center bg-no-repeat bg-fixed relative"
      style={{ backgroundImage: "url('/images/Sign Up.webp')" }}
    >
      {/* --- Bouton Back to Home --- */}
      <div className="absolute top-8 left-8">
        <Link 
          to="/home"
          onMouseEnter={() => setIsBackHovered(true)}
          onMouseLeave={() => setIsBackHovered(false)}
          className={`
            flex items-center bg-[#29ac96] text-white shadow-lg 
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden
            ${isBackHovered ? 'w-[200px] h-12 rounded-full px-4' : 'w-12 h-12 rounded-2xl justify-center'}
          `}
        >
          <div className="relative w-8 h-6 shrink-0 flex items-center justify-center">
            <div className={`absolute flex items-center transition-all duration-500 ease-out ${isBackHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="w-[2px] h-4 bg-white rounded-full mr-[2px]"></div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </div>
            <div className={`absolute transition-all duration-500 ease-in ${isBackHovered ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625A1.875 1.875 0 013.75 19.875v-6.198c.03-.028.06-.056.091-.086L12 5.432z" />
              </svg>
            </div>
          </div>
          <div className={`transition-all duration-500 overflow-hidden ${isBackHovered ? 'max-w-[140px] ml-4 opacity-100' : 'max-w-0 opacity-0 ml-0'}`}>
            <span className="font-bold whitespace-nowrap text-base font-montserrat">
              {t('back_home')}
            </span>
          </div>
        </Link>
      </div>

      {/* --- CARD DE SELECTION --- */}
      <div className="bg-white rounded-[40px] shadow-2xl py-12 px-10 max-w-md w-full text-center flex flex-col items-center">
        
        {/* Logo SHOT - Ne change pas */}
        <div className="mb-8 cursor-pointer" onClick={() => navigate('/home')}>
          <img loading="lazy" decoding="async" src="/images/logo_SHOT.webp" alt="S.HOT Logo" className="h-10 w-auto object-contain mx-auto" />
        </div>

        {/* IcÃ´ne Users BEAUCOUP PLUS GRANDE */}
        <div className="mb-8 text-[#238d7b]">
          <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Personne gauche */}
            <circle cx="38" cy="38" r="18" stroke="currentColor" strokeWidth="3.5" fill="none"/>
            <path d="M16 100 C16 78, 23 64, 38 64 C53 64, 60 78, 60 100" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            
            {/* Personne centre */}
            <circle cx="90" cy="30" r="22" stroke="currentColor" strokeWidth="3.5" fill="none"/>
            <path d="M62 105 C62 78, 72 58, 90 58 C108 58, 118 78, 118 105" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            
            {/* Personne droite */}
            <circle cx="142" cy="38" r="18" stroke="currentColor" strokeWidth="3.5" fill="none"/>
            <path d="M120 100 C120 78, 127 64, 142 64 C157 64, 164 78, 164 100" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            
            {/* Cercle plus (beaucoup plus grand) */}
            <circle cx="138" cy="95" r="25" fill="currentColor"/>
            <line x1="138" y1="82" x2="138" y2="108" stroke="white" strokeWidth="4.5" strokeLinecap="round"/>
            <line x1="125" y1="95" x2="151" y2="95" stroke="white" strokeWidth="4.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Titre */}
        <h2 className="text-[22px] font-extrabold text-gray-900 mb-3 px-2 leading-snug">
          {t('auth_gateway_community_title')}
        </h2>
        
        {/* Sous-titre */}
        <p className="text-gray-600 text-[15px] mb-8 leading-relaxed px-4 font-medium">
          {t('auth_gateway_community_subtitle')}
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-row gap-4 w-full px-2 mb-6">
          <Button 
            variant="primary"
            className="flex-1"
            onClick={() => navigate('/login', { state: { from } })}
          >
            {t('login')}
          </Button>
          
          <Button 
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/register', { state: { from } })}
          >
            {t('signup')}
          </Button>
        </div>

        {/* Bouton Cancel */}
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-500 font-semibold text-[15px] hover:text-gray-700 transition-colors"
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  );
};

export default AuthGateway;