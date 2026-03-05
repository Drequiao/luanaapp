import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Badge from '../ui/Badge';
import { fmtDate, fmt } from '../../utils/format';

export default function Clientes() {
  const { clientes, openDrawer } = useApp();
  const [search, setSearch] = useState('');

  const f = search.toLowerCase();
  const filtered = clientes
    .filter(c => !f || c.nome.toLowerCase().includes(f) || (c.projeto || '').toLowerCase().includes(f))
    .sort((a, b) => (b.criadoEm || 0) - (a.criadoEm || 0));

  const countLabel =
    clientes.length === 0 ? 'Nenhum cliente' :
    clientes.length === 1 ? '1 cliente' :
    `${clientes.length} clientes`;

  return (
    <div>
      <div className="section-title"><span>Clientes</span></div>
      <div className="section-sub">{countLabel}</div>

      <div className="search-bar">
        <input
          className="search-input"
          placeholder="Buscar cliente..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p>
            {search
              ? `Nenhum resultado para "${search}"`
              : 'Toque no ＋ para adicionar o primeiro cliente!'}
          </p>
        </div>
      ) : (
        filtered.map(c => (
          <div
            key={c.id}
            onClick={() => openDrawer('detalhe', c.id)}
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--gold-border)',
              borderRadius: 'var(--radius)',
              padding: 16,
              marginBottom: 10,
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text)' }}>{c.nome}</div>
              <Badge status={c.status} />
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8 }}>{c.projeto || '—'}</div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text3)', flexWrap: 'wrap' }}>
              {c.local && <span>📍 {c.local}</span>}
              {c.tamanho && <span>📐 {c.tamanho}</span>}
              {c.data && <span>📅 {fmtDate(c.data)}</span>}
              {c.valor && <span>💰 {fmt(c.valor)}</span>}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
