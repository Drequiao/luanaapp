import { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import Badge from '../ui/Badge';
import { fmt, fmtDate, monthNames, dayNamesFull, statusDots } from '../../utils/format';

export default function Dashboard() {
  const { clientes, openDrawer, importClientes, showToast } = useApp();
  const fileRef = useRef(null);

  const today = new Date();
  const mo = today.getMonth();
  const yr = today.getFullYear();

  const ativos = clientes.filter(c => c.status !== 'cancelado');

  const thisMonthSessoes = clientes.filter(c => {
    if (!c.data) return false;
    const d = new Date(c.data + 'T12:00:00');
    return d.getMonth() === mo && d.getFullYear() === yr &&
      (c.status === 'agendado' || c.status === 'concluido');
  });

  const sinais = clientes.reduce((s, c) => s + (parseFloat(c.sinal) || 0), 0);

  const receber = clientes
    .filter(c => c.status !== 'cancelado' && c.status !== 'concluido')
    .reduce((s, c) => s + Math.max(0, (parseFloat(c.valor) || 0) - (parseFloat(c.sinal) || 0)), 0);

  const faturamento = clientes
    .filter(c => {
      if (c.status !== 'concluido' || !c.data) return false;
      const d = new Date(c.data + 'T12:00:00');
      return d.getMonth() === mo && d.getFullYear() === yr;
    })
    .reduce((s, c) => s + (parseFloat(c.valor) || 0), 0);

  const recent = [...clientes]
    .sort((a, b) => (b.criadoEm || 0) - (a.criadoEm || 0))
    .slice(0, 5);

  const proxima = clientes
    .filter(c => c.data && c.status !== 'cancelado' && c.status !== 'concluido')
    .sort((a, b) => a.data.localeCompare(b.data))[0];

  function handleExport() {
    const json = JSON.stringify(clientes, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `luanaapp-backup-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`✓ Backup exportado (${clientes.length} clientes)`);
  }

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if (!Array.isArray(data)) {
          showToast('Arquivo inválido: esperado uma lista de clientes.', true);
          return;
        }
        const confirm = window.confirm(
          `Importar ${data.length} clientes? Isso vai substituir todos os dados atuais.`
        );
        if (confirm) {
          importClientes(data);
        }
      } catch {
        showToast('Erro ao ler o arquivo. Verifique o formato.', true);
      }
      // Reset input pra permitir reimportar o mesmo arquivo
      if (fileRef.current) fileRef.current.value = '';
    };
    reader.readAsText(file);
  }

  return (
    <div>
      <div className="section-title">
        Olá, <span>Luana</span> 🖤
      </div>
      <div className="section-sub">
        {dayNamesFull[today.getDay()]}, {today.getDate()} de {monthNames[mo]}
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        <div style={{ gridColumn: '1 / -1', background: 'var(--bg2)', border: '1px solid var(--gold-border)', borderRadius: 'var(--radius)', padding: 16, textAlign: 'center' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>
            {fmt(faturamento)}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 6 }}>
            Faturamento do Mês
          </div>
        </div>

        {[
          { val: ativos.length, label: 'Clientes Ativos' },
          { val: thisMonthSessoes.length, label: 'Sessões este Mês' },
          { val: fmt(sinais), label: 'Sinais Recebidos' },
          { val: fmt(receber), label: 'A Receber' },
        ].map(({ val, label }) => (
          <div key={label} style={{ background: 'var(--bg2)', border: '1px solid var(--gold-border)', borderRadius: 'var(--radius)', padding: 16, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>
              {val}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 6 }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="card">
        <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 14 }}>
          Atividade Recente
        </div>
        {recent.length === 0 ? (
          <div className="empty-state" style={{ padding: '20px 0' }}>
            <div className="empty-icon">🌙</div>
            <p>Nenhuma atividade ainda.<br />Adicione seu primeiro cliente!</p>
          </div>
        ) : (
          recent.map(c => (
            <div key={c.id} className="activity-item" onClick={() => openDrawer('detalhe', c.id)}>
              <div className="activity-dot" style={{ background: statusDots[c.status] }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{c.nome}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.projeto || '—'}
                </div>
              </div>
              <Badge status={c.status} />
            </div>
          ))
        )}
      </div>

      {/* Next session */}
      <div className="card" style={{ background: 'linear-gradient(135deg,#1a1410,#1e1810)', borderColor: 'rgba(201,169,110,0.4)' }}>
        <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 }}>
          ✦ Próxima Sessão
        </div>
        {proxima ? (
          <div>
            <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--text)' }}>{proxima.nome}</div>
            <div style={{ fontSize: 13, color: 'var(--gold)', marginTop: 4 }}>
              📅 {fmtDate(proxima.data)}{proxima.hora ? ` às ${proxima.hora}` : ''}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>{proxima.projeto || ''}</div>
          </div>
        ) : (
          <div style={{ color: 'var(--text2)', fontSize: 14 }}>Nenhuma sessão agendada.</div>
        )}
      </div>

      {/* Backup */}
      <div className="card" style={{ marginTop: 4 }}>
        <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 14 }}>
          🔒 Seus Dados
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button className="btn btn-secondary" onClick={handleExport}>
            📤 Exportar
          </button>
          <button className="btn btn-secondary" onClick={() => fileRef.current?.click()}>
            📥 Importar
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 10, lineHeight: 1.5 }}>
          Exporte seus dados regularmente para não perder informações.
        </div>
      </div>
    </div>
  );
}
