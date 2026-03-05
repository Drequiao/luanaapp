const tabs = [
  { id: 'dash', icon: '🏠', label: 'Início' },
  { id: 'clientes', icon: '👥', label: 'Clientes' },
  { id: 'agenda', icon: '📅', label: 'Agenda' },
  { id: 'finance', icon: '💰', label: 'Financeiro' },
];

export default function Nav({ active, onNav }) {
  return (
    <nav style={{
      display: 'flex',
      background: 'var(--bg2)',
      borderTop: '1px solid var(--gold-border)',
      flexShrink: 0,
      paddingBottom: 'var(--sab)',
      paddingLeft: 'var(--sal)',
      paddingRight: 'var(--sar)',
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onNav(tab.id)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            padding: '12px 4px 14px',
            minHeight: 56,
            background: 'none',
            border: 'none',
            borderTop: active === tab.id ? '2px solid var(--gold)' : '2px solid transparent',
            color: active === tab.id ? 'var(--gold)' : 'var(--text3)',
            fontSize: 9,
            letterSpacing: 1,
            textTransform: 'uppercase',
            fontFamily: "'DM Sans', sans-serif",
            cursor: 'pointer',
            transition: 'color 0.2s',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span style={{ fontSize: 22, lineHeight: 1 }}>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
