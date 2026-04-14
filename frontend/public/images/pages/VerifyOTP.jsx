import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isHoveredContinue, setIsHoveredContinue] = useState(false);
  const [isHoveredResend, setIsHoveredResend] = useState(false);
  const [isBackHomeHovered, setIsBackHomeHovered] = useState(false);

  // --- Logique du Compteur ---
  const [timeLeft, setTimeLeft] = useState(300); // 300 secondes = 5 minutes

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Formattage du temps (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleResend = () => {
    if (timeLeft === 0) {
      // Logique pour renvoyer le code ici
      setTimeLeft(300); // Relancer le compteur après clic
    }
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value) element.nextSibling.focus();
  };

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
            <div className={`absolute flex items-center transition-all duration-500 ease-out ${isBackHomeHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="w-[2px] h-4 bg-white rounded-full mr-[2px]"></div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </div>
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
        <div className="mb-10 h-7">
          <img src="/images/logo_SHOT.png" alt="S.HOT Logo" className="h-full w-auto" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
        <p className="text-gray-600 text-sm mb-10 px-4">Enter the verification code sent to your inbox</p>

        <div className="flex justify-center gap-4 mb-10">
          {otp.map((data, index) => (
            <input 
              key={index} 
              type="text" 
              maxLength="1" 
              className="w-14 h-14 border border-gray-200 rounded-2xl text-center text-xl font-bold focus:border-[#0a9382] outline-none transition-all" 
              value={data} 
              onChange={e => handleChange(e.target, index)} 
            />
          ))}
        </div>

        <Link to="/reset-password" title="Continue" className="block w-full mb-8">
          <button 
            onMouseEnter={() => setIsHoveredContinue(true)}
            onMouseLeave={() => setIsHoveredContinue(false)}
            className="w-full bg-[#238d7b] hover:bg-[#1db096] text-white font-bold py-4 rounded-3xl shadow-lg transition-all flex items-center justify-center gap-1 relative overflow-hidden"
          >
            <span className={`transition-all duration-300 ${isHoveredContinue ? '-translate-x-1' : 'translate-x-0'}`}>
              Continue
            </span>
            <div className={`flex items-center transition-all duration-300 ${isHoveredContinue ? 'opacity-100 translate-x-0.5' : 'opacity-0 -translate-x-1'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              <span className="h-5 w-[2px] bg-white rounded-full ml-0.5 inline-block"></span>
            </div>
          </button>
        </Link>

        {/* --- Section Compteur & Resend --- */}
        <div className="w-full space-y-4">
          <p className="text-gray-500 text-sm">
            {timeLeft > 0 ? (
              <>Resend code available in <span className="font-bold text-[#238d7b]">{formatTime(timeLeft)}</span></>
            ) : (
              "Didn't receive the code?"
            )}
          </p>
          <button 
            disabled={timeLeft > 0}
            onClick={handleResend}
            onMouseEnter={() => timeLeft === 0 && setIsHoveredResend(true)}
            onMouseLeave={() => setIsHoveredResend(false)}
            className={`
              w-full py-4 border border-[#1cb1a5] font-bold rounded-3xl transition-all flex items-center justify-center gap-1 relative overflow-hidden
              ${timeLeft > 0 
                ? 'opacity-50 cursor-not-allowed text-gray-400 border-gray-300' 
                : 'text-[#102321] hover:bg-[#ecfbf9] hover:text-black'
              }
            `}
          >
            <span className={`transition-all duration-300 ${isHoveredResend ? '-translate-x-1' : 'translate-x-0'}`}>
              Resend Code
            </span>

            <div className={`flex items-center transition-all duration-300 ${isHoveredResend ? 'opacity-100 translate-x-0.5' : 'opacity-0 -translate-x-1'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#1cb1a5" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              <span className="h-5 w-[2px] bg-[#1cb1a5] rounded-full ml-0.5 inline-block"></span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;