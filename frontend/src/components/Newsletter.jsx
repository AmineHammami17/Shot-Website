import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Newsletter = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const colors = {
    primaryGreen: '#14a394',
    inputBg: 'rgba(5, 70, 60, 0.8)',
    inputBorder: '#26bba4',
    textWhite: '#ffffff'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() && name.trim()) {
      setIsSubscribed(true);
    }
  };

  return (
    <div
      className="relative overflow-hidden px-4 py-14 sm:py-20"
      style={{
        background: '#022c26',
        backgroundImage: "url('/images/NL_bg.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white !important;
          -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }
      `}</style>

      <div className="mx-auto w-full max-w-4xl text-center">
        <h3 className="mb-3 text-3xl font-bold sm:text-4xl" style={{ color: colors.inputBorder }}>
          {t('newsletter_title')}
        </h3>
        
        <p className="mx-auto mb-8 max-w-2xl px-2 text-sm leading-relaxed text-white/90 sm:mb-10 sm:text-lg">
          {t('news_desc')}
        </p>

        <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-5">
          <div
            className="flex flex-col gap-2 rounded-3xl border p-2 shadow-xl sm:flex-row sm:items-center"
            style={{
              background: colors.inputBg,
              borderColor: colors.inputBorder,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
          >
            <input
              type="text"
              name="name"
              placeholder={t('news_placeholder_name')}
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-2xl border-0 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/60 sm:text-base"
              required
            />

            <div className="mx-2 hidden h-6 w-px sm:block" style={{ background: colors.inputBorder, opacity: 0.4 }} />

            <input
              type="email"
              name="email"
              placeholder={t('news_placeholder_email')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-2xl border-0 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/60 sm:text-base"
              required
            />
          </div>

          <button 
            type="submit" 
            className="mx-auto inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110 sm:text-base"
            style={{ background: colors.primaryGreen, boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
          >
            {t('news_btn')}
          </button>
        </form>
      </div>

      {isSubscribed && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', padding: '28px 24px', borderRadius: '28px',
            width: '92%', maxWidth: '400px', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}>
            <img loading="lazy" decoding="async" src="/images/logo_SHOT.webp" alt="S.HOT" style={{ width: '100px', marginBottom: '25px' }} />
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              border: `4px solid ${colors.primaryGreen}`, display: 'flex',
              alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={colors.primaryGreen} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#000' }}>{t('thanks')}</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>{t('confirm_sub')}</p>
            <button
              onClick={() => setIsSubscribed(false)}
              style={{
                background: colors.primaryGreen, color: 'white', border: 'none',
                borderRadius: '50px', padding: '12px 40px', cursor: 'pointer', width: '100%'
              }}
            >
              {t('done')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newsletter;