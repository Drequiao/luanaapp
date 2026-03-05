import Drawer from '../ui/Drawer';
import Badge from '../ui/Badge';
import { useApp } from '../../context/AppContext';
import { fmt, fmtDate } from '../../utils/format';

export default function DetalheDrawer() {
  const { drawer, closeDrawer, openDrawer, clientes } = useApp();

  const isOpen = drawer?.type === 'detalhe';
  const id = drawer?.data;
  const c = clientes.find(x => x.id === id);

  if (!c) return null;

  const resta = Math.max(0, (parseFloat(c.valor) || 0) - (parseFloat(c.sinal) || 0));
  const waNum = c.wa ? c.wa.replace(/\D/g, '') : '';
  const waMsg = encodeURIComponent(
    `Oi ${c.nome}! 🌙 Passando para confirmar sua sessão de tatuagem. Qualquer dúvida, é só me falar! 🖤 - Luana Dórea`
  );

  function handleEdit() {
    closeDrawer();
    setTimeout(() => openDrawer('cliente', c), 350);
  }

  return (
    <Drawer open={isOpen} onClose={closeDrawer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: 'var(--text)' }}>
            {c.nome}
          </div>
          <div style={{ marginTop: 6 }}>
            <Badge status={c.status} />
          </div>
        </div>
        <button className="btn btn-sm btn-secondary" onClick={handleEdit} style={{ flexShrink: 0 }}>
          ✏️ Editar
        </button>
      </div>

      <div className="card-sm">
        <div style={{ fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 6 }}>Projeto</div>
        <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>{c.projeto || '—'}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '10px 0' }}>
        <div className="card-sm">
          <div style={{ fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 4 }}>Local</div>
          <div style={{ fontSize: 14, color: 'var(--text)' }}>{c.local || '—'}</div>
        </div>
        <div className="card-sm">
          <div style={{ fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 4 }}>Tamanho</div>
          <div style={{ fontSize: 14, color: 'var(--text)' }}>{c.tamanho || '—'}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
        <div className="card-sm" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 4 }}>Valor</div>
          <div style={{ fontSize: 16, color: 'var(--gold)', fontFamily: "'Cormorant Garamond', serif" }}>{fmt(c.valor)}</div>
        </div>
        <div className="card-sm" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 4 }}>Sinal</div>
          <div style={{ fontSize: 16, color: 'var(--blue)', fontFamily: "'Cormorant Garamond', serif" }}>{fmt(c.sinal)}</div>
        </div>
        <div className="card-sm" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 4 }}>Resta</div>
          <div style={{ fontSize: 16, color: 'var(--red)', fontFamily: "'Cormorant Garamond', serif" }}>{fmt(resta)}</div>
        </div>
      </div>

      {c.data && (
        <div className="card-sm">
          <div style={{ fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 4 }}>📅 Sessão Agendada</div>
          <div style={{ fontSize: 15, color: 'var(--gold)' }}>
            {fmtDate(c.data)}{c.hora ? ` às ${c.hora}` : ''}
          </div>
        </div>
      )}

      {c.obs && (
        <div className="card-sm" style={{ marginTop: 8 }}>
          <div style={{ fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 4 }}>Observações</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{c.obs}</div>
        </div>
      )}

      {waNum && (
        <a className="wa-btn" href={`https://wa.me/55${waNum}?text=${waMsg}`} target="_blank" rel="noreferrer">
          📱 Abrir WhatsApp — {c.wa}
        </a>
      )}

      <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={closeDrawer}>
        Fechar
      </button>
    </Drawer>
  );
}
