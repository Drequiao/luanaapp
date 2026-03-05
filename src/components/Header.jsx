import { monthNames } from '../utils/format';

export default function Header() {
  const now = new Date();
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();

  return (
    <div style={{
      background: 'var(--bg2)',
      borderBottom: '1px solid var(--gold-border)',
      paddingTop: 'calc(16px + var(--sat))',
      paddingBottom: 12,
      paddingLeft: 'calc(20px + var(--sal))',
      paddingRight: 'calc(20px + var(--sar))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: 'var(--text)', letterSpacing: 1 }}>
          Luana <span style={{ color: 'var(--gold)' }}>Dórea</span>
        </div>
        <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--text3)', textTransform: 'uppercase', marginTop: 1 }}>
          Studio · Salvador
        </div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text3)', textAlign: 'right' }}>
        {month} {year}
      </div>
    </div>
  );
}
