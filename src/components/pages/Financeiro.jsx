import { useApp } from '../../context/AppContext';
import { fmt, fmtDate, monthNames } from '../../utils/format';

export default function Financeiro() {
  const { clientes, openDrawer } = useApp();

  const today = new Date();
  const mo = today.getMonth();
  const yr = today.getFullYear();

  const thisMonth = clientes.filter(c => {
    if (!c.data || c.status === 'cancelado') return false;
    const d = new Date(c.data + 'T12:00:00');
    return d.getMonth() === mo && d.getFullYear() === yr;
  });

  const concluidos = thisMonth.filter(c => c.status === 'concluido');
  const faturamento = concluidos.reduce((s, c) => s + (parseFloat(c.valor) || 0), 0);
  const sinais = clientes.reduce((s, c) => s + (parseFloat(c.sinal) || 0), 0);
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
      <div className="section-sub">{monthNames[mo]} de {yr}</div>

      {/* Total banner */}
      <div style={{
        textAlign: 'center', padding: 24,
        background: 'linear-gradient(135deg, var(--bg2), var(--bg3))',
        border: '1px solid var(--gold-border)',
        borderRadius: 'var(--radius)', marginBottom: 20,
      }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>
          {fmt(faturamento + sinais)}
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
          { val: fmt(sinais), label: 'Sinais', color: 'var(--blue)' },
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
