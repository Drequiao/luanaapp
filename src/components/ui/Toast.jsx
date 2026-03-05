import { useApp } from '../../context/AppContext';

export default function Toast() {
  const { toast } = useApp();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 90,
        left: 20,
        right: 20,
        background: toast.error ? 'var(--red)' : 'var(--green)',
        color: 'white',
        padding: '14px 18px',
        borderRadius: 'var(--radius-sm)',
        fontSize: 14,
        fontWeight: 500,
        zIndex: 200,
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        opacity: toast.visible ? 1 : 0,
        transform: toast.visible ? 'translateY(0)' : 'translateY(10px)',
        pointerEvents: toast.visible ? 'auto' : 'none',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }}
    >
      {toast.msg}
    </div>
  );
}
