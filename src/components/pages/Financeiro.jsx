import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { fmt, fmtDate, monthNames } from '../../utils/format';

export default function Financeiro() {
  const { clientes, openDrawer } = useApp();

  const today = new Date();
  const [mo, setMo] = useState(today.getMonth());
  const [yr, setYr] = useState(today.getFullYear());

  const isCurrentMonth = mo === today.getMonth() && yr === today.getFullYear();

  function prevMonth() {
    if (mo === 0) { setMo(11); setYr(yr - 1); }
    else setMo(mo - 1);
  }

  function nextMonth() {
    if (isCurrentMonth) return;
    if (mo === 11) { setMo(0); setYr(yr + 1); }
    else setMo(mo + 1);
  }

  // Clientes do mês selecionado (exceto cancelados)
  const thisMonth = clientes.filter(c => {
    if (!c.data || c.status === 'cancelado') return false;
    const d = new Date(c.data + 'T12:00:00');
    return d.getMonth() === mo && d.getFullYear() === yr;
  });

  const concluidos = thisMonth.filter(c => c.status === 'concluido');
  const faturamento = concluidos.reduce((s, c) => s + (parseFloat(c.valor) || 0), 0);
  const sinaisMes = thisMonth.reduce((s, c) => s + (parseFloat(c.sinal) || 0), 0);
  const receber = clientes
    .filter(c => c.status !== 'cancelado' && c.status !== 'concluido')
    .reduce((s, c) => s + Math.max(0, (parseFloat(c.valor) || 0) - (parseFloat(c.sinal) || 0)), 0);

  const pendencias = clientes
    .filter(c =>
      c.status !== 'cancelado' && c.status !== 'concluido' &&
      (parseFloat(c.valor) || 0) > (parseFloat(c.sinal) || 0)
    )
    .sort((a, b) => (a.data || '').localeCompare(b.data || ''));

  return (
    <div>
      <div className="section-title"><span>Financeiro</span></div>

      {/* Navegação de meses */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 20,
      }}>
        <button
          onClick={prevMonth}
          style={{
            background: 'var(--bg3)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 'var(--radius-sm)', padding: '8px 14px',
            color: 'var(--text2)', fontSize: 16, cursor: 'pointer',
          }}
        >
          ‹
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 15, fontWeight: 500, color: 'var(--text)',
            fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.5px',
          }}>
            {monthNames[mo]} de {yr}
          </div>
          {isCurrentMonth && (
            <div style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 2 }}>
              Mês atual
            </div>
          )}
        </div>
        <button
          onClick={nextMonth}
          style={{
            background: 'var(--bg3)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 'var(--radius-sm)', padding: '8px 14px',
            color: isCurrentMonth ? 'var(--text3)' : 'var(--text2)',
            fontSize: 16, cursor: isCurrentMonth ? 'default' : 'pointer',
            opacity: isCurrentMonth ? 0.4 : 1,
          }}
        >
          ›
        </button>
      </div>

      {/* Total banner */}
      <div style={{
        textAlign: 'center', padding: 24,
        background: 'linear-gradient(135deg, var(--bg2), var(--bg3))',
        border: '1px solid var(--gold-border)',
        borderRadius: 'var(--radius)', marginBottom: 20,
      }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>
          {fmt(faturamento + sinaisMes)}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: 8 }}>
          Faturamento Total do Mês
        </div>
      </div>

      {/* Finance grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[
          { val: fmt(faturamento), label: 'Recebido', color: 'var(--green)' },
          { val: fmt(receber), label: 'A Receber', color: 'var(--red)' },
          { val: fmt(sinaisMes), label: 'Sinais do Mês', color: 'var(--blue)' },
          { val: thisMonth.length, label: 'Sessões', color: 'var(--gold)' },
        ].map(({ val, label, color }) => (
          <div key={label} style={{ background: 'var(--bg2)', border: '1px solid var(--gold-border)', borderRadius: 'var(--radius)', padding: 16, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, lineHeight: 1, color }}>
              {val}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 6 }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Pending payments */}
      <div className="card">
        <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 14 }}>
          ⚠️ Pendências de Pagamento
        </div>
        {pendencias.length === 0 ? (
          <p style={{ color: 'var(--text3)', fontSize: 13 }}>Nenhuma pendência 🎉</p>
        ) : (
          pendencias.map(c => {
            const resta = Math.max(0, (parseFloat(c.valor) || 0) - (parseFloat(c.sinal) || 0));
            return (
              <div
                key={c.id}
                onClick={() => openDrawer('detalhe', c.id)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{c.nome}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>{c.data ? fmtDate(c.data) : 'Sem data'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, color: 'var(--red)', fontFamily: "'Cormorant Garamond', serif" }}>{fmt(resta)}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>a receber</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
