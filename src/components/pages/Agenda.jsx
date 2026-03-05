import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Badge from '../ui/Badge';
import { monthNames, dayNamesShort } from '../../utils/format';

export default function Agenda() {
  const { clientes, openDrawer } = useApp();
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  const today = new Date();

  // Build events map
  const eventsMap = {};
  clientes.forEach(c => {
    if (!c.data || c.status === 'cancelado') return;
    const d = new Date(c.data + 'T12:00:00');
    if (d.getMonth() === calMonth && d.getFullYear() === calYear) {
      const day = d.getDate();
      if (!eventsMap[day]) eventsMap[day] = [];
      eventsMap[day].push(c);
    }
  });

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
    setSelectedDay(null);
  }

  const dayEvents = selectedDay ? (eventsMap[selectedDay] || []) : [];

  return (
    <div>
      <div className="section-title"><span>Agenda</span></div>
      <div className="section-sub">Clique num dia para ver detalhes</div>

      <div className="card">
        {/* Calendar header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button
            onClick={prevMonth}
            style={{ width: 36, height: 36, background: 'var(--bg3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', color: 'var(--text2)', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >‹</button>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: 'var(--text)' }}>
            {monthNames[calMonth]} {calYear}
          </div>
          <button
            onClick={nextMonth}
            style={{ width: 36, height: 36, background: 'var(--bg3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', color: 'var(--text2)', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >›</button>
        </div>

        {/* Day names */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {dayNamesShort.map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 10, color: 'var(--text3)', letterSpacing: 1, padding: '4px 0 8px' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const d = i + 1;
            const isToday = today.getDate() === d && today.getMonth() === calMonth && today.getFullYear() === calYear;
            const hasEvent = !!eventsMap[d];
            const isSelected = selectedDay === d;

            let bg = 'transparent';
            let color = 'var(--text2)';
            let fontWeight = 400;

            if (isSelected) { bg = 'var(--gold)'; color = 'var(--bg)'; fontWeight = 700; }
            else if (hasEvent) { bg = 'var(--gold-dim)'; color = 'var(--gold)'; fontWeight = 500; }
            else if (isToday) { color = 'var(--gold)'; fontWeight = 600; }

            return (
              <div
                key={d}
                onClick={() => setSelectedDay(d === selectedDay ? null : d)}
                style={{
                  aspectRatio: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  fontSize: 13,
                  color,
                  fontWeight,
                  background: bg,
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {d}
                {isToday && !isSelected && (
                  <span style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, background: 'var(--gold)', borderRadius: '50%' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Day events */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 12 }}>
          {selectedDay
            ? `${selectedDay} de ${monthNames[calMonth]} — ${dayEvents.length === 0 ? 'Livre' : `${dayEvents.length} sessão${dayEvents.length > 1 ? 'ões' : ''}`}`
            : 'Selecione um dia'}
        </div>

        {selectedDay && dayEvents.length === 0 && (
          <div style={{ color: 'var(--text3)', fontSize: 13, padding: '12px 0' }}>Dia livre ✨</div>
        )}

        {selectedDay && (
          <button
            className="btn btn-primary"
            style={{ marginBottom: 12, fontSize: 12, padding: 12 }}
            onClick={() => {
              const mm = String(calMonth + 1).padStart(2, '0');
              const dd = String(selectedDay).padStart(2, '0');
              openDrawer('cliente', { data: `${calYear}-${mm}-${dd}` });
            }}
          >
            ＋ Sessão neste dia
          </button>
        )}

        {dayEvents.map(c => (
          <div
            key={c.id}
            onClick={() => openDrawer('detalhe', c.id)}
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
        ))}
      </div>
    </div>
  );
}
