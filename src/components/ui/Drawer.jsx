export default function Drawer({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
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
