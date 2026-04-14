import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-6 py-3 font-bold transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden';
  
  const variants = {
    // Vert SHOT
    primary: 'bg-[#238d7b] text-white hover:bg-[#1db096] shadow-lg rounded-3xl', 
    // Gris clair
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-2xl',
    // Bordure verte
    outline: 'border-2 border-[#238d7b] text-[#238d7b] hover:bg-[#ecfbf9] rounded-3xl',
    // Pour la page Login/Register
    auth: 'bg-[#238d7b] text-white py-4 rounded-2xl w-full shadow-lg hover:bg-[#1db096]'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;