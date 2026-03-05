import { useState, useEffect, useCallback } from 'react';

export default function Drawer({ open, onClose, children }) {
  // mounted controla se o DOM existe; visible controla a animação
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Pequeno delay pra garantir que o DOM renderizou antes de animar
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      // Espera a animação de saída antes de desmontar
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        style={{
          background: 'var(--bg2)',
          borderRadius: '24px 24px 0 0',
          borderTop: '1px solid var(--gold-border)',
          paddingTop: 20,
          paddingLeft: 'calc(20px + var(--sal))',
          paddingRight: 'calc(20px + var(--sar))',
          paddingBottom: 'calc(40px + var(--sab))',
          width: '100%',
          maxHeight: '92dvh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: 40,
            height: 4,
            background: 'var(--bg4)',
            borderRadius: 2,
            margin: '0 auto 20px',
          }}
        />
        {children}
      </div>
    </div>
  );
}
