const SubscribeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: 999, 
        background: 'rgba(0,0,0,0.5)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '20px' 
      }}
      onClick={onClose}
    >
      <div 
        style={{ 
          background: 'white', 
          borderRadius: 24, 
          padding: '52px 40px 44px', 
          maxWidth: 420, 
          width: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center', 
          boxShadow: '0 24px 60px rgba(0,0,0,0.25)', 
          animation: 'popIn .3s ease' 
        }}
        onClick={e => e.stopPropagation()}
      >
        <img loading="lazy" decoding="async" src="/images/logo_SHOT.webp" alt="S.HOT" style={{ height: 36, objectFit: 'contain', marginBottom: 36 }} />
        
        <div style={{ 
          width: 90, 
          height: 90, 
          borderRadius: '50%', 
          border: '3px solid #238d7b', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: 28 
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#238d7b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        
        <h3 style={{ fontWeight: 800, fontSize: 22, color: '#111827', marginBottom: 12 }}>Thank you !</h3>
        <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.6, marginBottom: 36 }}>
          Please check your inbox to confirm your subscription.
        </p>
        
        <button 
          onClick={onClose} 
          style={{ 
            width: '100%', 
            padding: '16px', 
            borderRadius: 50, 
            background: '#238d7b', 
            color: 'white', 
            fontWeight: 700, 
            fontSize: 16, 
            border: 'none', 
            cursor: 'pointer', 
            transition: 'background .2s ease' 
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#1a6e60'}
          onMouseLeave={e => e.currentTarget.style.background = '#238d7b'}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default SubscribeModal;