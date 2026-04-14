import { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBackHovered, setIsBackHovered] = useState(false);

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-6 font-montserrat bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/Sign Up.png')" }}
    >
      {/* Bouton Back to Home - Version Raka7 (Flèche + Barre collées) */}
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
          {/* Conteneur d'icônes stable */}
          <div className="relative w-8 h-6 shrink-0 flex items-center justify-center">
            {/* Barre + Flèche (Inversées et rapprochées) */}
            <div className={`absolute flex items-center transition-all duration-500 ease-out ${isBackHovered ? 'opacity-500 translate-x-0' : 'opacity-100 -translate-x-10'}`}>
              {/* La barre verticale à gauche */}
              <div className="w-[2px] h-4 bg-white  rounded-full mr-[2px]"></div>
              {/* La flèche à droite */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </div>

            {/* Icône Maison (Position par défaut) */}
            <div className={`absolute transition-all duration-500 ease-in ${isBackHovered ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625A1.875 1.875 0 013.75 19.875v-6.198c.03-.028.06-.056.091-.086L12 5.432z" />
              </svg>
            </div>
          </div>
          
          {/* Texte "Back to Home" */}
          <div className={`transition-all duration-500 overflow-hidden ${isBackHovered ? 'max-w-[140px] ml-4 opacity-100' : 'max-w-0 opacity-0 ml-0'}`}>
            <span className="font-bold whitespace-nowrap text-base">Back to Home</span>
          </div>
        </Link>
      </div>

      <div className="w-full max-w-[500px] flex flex-col items-center">
        {/* Le reste du formulaire reste inchangé */}
        <div className="mb-8 h-7 flex items-center justify-center">
          <img src="/images/logo_SHOT.png" alt="Logo" className="h-full w-auto object-contain" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Create Account</h1>
          <p className="text-[#333333] text-sm font-medium leading-relaxed max-w-[500px] mx-auto opacity-90">
            Join SHOT today and start your personalized wellness journey.
          </p>
        </div>
        
        <div className="w-full space-y-5">
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
            <input type="text" placeholder="Enter your full name..." className="w-full p-4 rounded-2xl border border-gray-100 bg-white/70 outline-none focus:ring-2 focus:ring-[#108a78]/20 focus:border-[#108a78] transition-all shadow-sm" />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
            <input type="email" placeholder="Enter your email..." className="w-full p-4 rounded-2xl border border-gray-100 bg-white/70 outline-none focus:ring-2 focus:ring-[#108a78]/20 focus:border-[#108a78] transition-all shadow-sm" />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
            <input type="password" placeholder="*******************" className="w-full p-4 rounded-2xl border border-gray-100 bg-white/70 outline-none focus:ring-2 focus:ring-[#108a78]/20 focus:border-[#108a78] transition-all shadow-sm" />
          </div>

          <button 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full bg-[#238d7b] hover:bg-[#1db096] text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-1 mt-4 relative group overflow-hidden"
          >
            <span className={`transition-all duration-300 ${isHovered ? '-translate-x-1' : 'translate-x-0'}`}>
              Create Account
            </span>
            <div className={`flex items-center transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0.5' : 'opacity-0 -translate-x-1'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              <span className="h-5 w-[3px] bg-white rounded-full ml-0.5 inline-block"></span>
            </div>
          </button>

          <div className="mt-8 text-center text-sm font-medium">
            <span className="text-black-500">Already have an account? </span>
            <Link to="/login" className="text-[#108a78] font-bold hover:underline ml-1">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;