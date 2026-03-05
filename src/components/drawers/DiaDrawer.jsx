import Drawer from '../ui/Drawer';
import Badge from '../ui/Badge';
import { useApp } from '../../context/AppContext';
import { monthNames } from '../../utils/format';

export default function DiaDrawer() {
  const { drawer, closeDrawer, openDrawer, clientes } = useApp();

  const isOpen = drawer?.type === 'dia';
  const { day, month, year } = drawer?.data || {};

  const events = clientes.filter(c => {
    if (!c.data || c.status === 'cancelado') return false;
    const d = new Date(c.data + 'T12:00:00');
    return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
  });

  function handleNovoCliente() {
    closeDrawer();
    setTimeout(() => openDrawer('cliente', null), 200);
  }

  return (
    <Drawer open={isOpen} onClose={closeDrawer}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, marginBottom: 20, color: 'var(--text)' }}>
        {day} de <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>{monthNames[month]}</span>
      </div>

      {events.length === 0 ? (
        <div style={{ color: 'var(--text3)', fontSize: 13, padding: '12px 0' }}>Dia livre ✨</div>
      ) : (
        events.map(c => (
          <div
            key={c.id}
            onClick={() => { closeDrawer(); setTimeout(() => openDrawer('detalhe', c.id), 200); }}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              padding: 12,
              background: 'var(--bg3)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 8,
              borderLeft: '3px solid var(--gold)',
              cursor: 'pointer',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 15 }}>{c.nome}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
                {c.hora ? `${c.hora} · ` : ''}{c.projeto || ''}
              </div>
            </div>
            <Badge status={c.status} />
          </div>
        ))
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button className="btn btn-secondary" onClick={closeDrawer}>Fechar</button>
        <button className="btn btn-primary" onClick={handleNovoCliente}>+ Cliente neste dia</button>
      </div>
    </Drawer>
  );
}
