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
        display: toast.visible ? 'block' : 'none',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        transition: 'opacity 0.2s',
      }}
    >
      {toast.msg}
    </div>
  );
}
