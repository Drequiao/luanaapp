import { useState, useEffect } from 'react';
import Drawer from '../ui/Drawer';
import { useApp } from '../../context/AppContext';

const empty = {
  nome: '', wa: '', ig: '', projeto: '', local: '', tamanho: '',
  valor: '', sinal: '', data: '', hora: '', status: 'orcamento', obs: '',
};

export default function ClienteDrawer() {
  const { drawer, closeDrawer, addCliente, updateCliente, deleteCliente, showToast } = useApp();

  const isOpen = drawer?.type === 'cliente';
  const drawerData = drawer?.data || null;
  // Se tem id, é edição; senão é novo (possivelmente com dados pré-preenchidos)
  const editCliente = drawerData?.id ? drawerData : null;
  const prefill = !editCliente ? drawerData : null;

  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (isOpen) {
      if (editCliente) {
        setForm({
          nome: editCliente.nome || '',
          wa: editCliente.wa || '',
          ig: editCliente.ig || '',
          projeto: editCliente.projeto || '',
          local: editCliente.local || '',
          tamanho: editCliente.tamanho || '',
          valor: editCliente.valor || '',
          sinal: editCliente.sinal || '',
          data: editCliente.data || '',
          hora: editCliente.hora || '',
          status: editCliente.status || 'orcamento',
          obs: editCliente.obs || '',
        });
      } else {
        setForm({ ...empty, ...(prefill || {}) });
      }
    }
  }, [isOpen, editCliente, prefill]);

  const set = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  function handleSave() {
    if (!form.nome.trim()) { showToast('Nome é obrigatório!', true); return; }
    if (editCliente) {
      updateCliente(editCliente.id, form);
    } else {
      addCliente(form);
    }
    closeDrawer();
  }

  function handleDelete() {
    if (!window.confirm('Excluir este cliente?')) return;
    deleteCliente(editCliente.id);
    closeDrawer();
  }

  return (
    <Drawer open={isOpen} onClose={closeDrawer}>
      <div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 24,
          fontWeight: 300,
          marginBottom: 20,
          color: 'var(--text)',
        }}
      >
        {editCliente ? 'Editar' : 'Novo'}{' '}
        <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Cliente</span>
      </div>

      <div className="form-group">
        <label className="form-label">Nome completo</label>
        <input className="form-input" value={form.nome} onChange={set('nome')} placeholder="Nome do cliente" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">WhatsApp</label>
          <input className="form-input" value={form.wa} onChange={set('wa')} placeholder="(71) 99999-9999" type="tel" />
        </div>
        <div className="form-group">
          <label className="form-label">Instagram</label>
          <input className="form-input" value={form.ig} onChange={set('ig')} placeholder="@usuario" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Ideia / Projeto</label>
        <textarea className="form-input" value={form.projeto} onChange={set('projeto')} placeholder="Ex: ramo de flores no antebraço, fine line delicado..." />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Local do corpo</label>
          <input className="form-input" value={form.local} onChange={set('local')} placeholder="Ex: antebraço" />
        </div>
        <div className="form-group">
          <label className="form-label">Tamanho</label>
          <select className="form-input" value={form.tamanho} onChange={set('tamanho')}>
            <option value="">Selecione</option>
            <option>Pequena (até 5cm)</option>
            <option>Média (5-10cm)</option>
            <option>Grande (10-20cm)</option>
            <option>Muito grande (+20cm)</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Valor total (R$)</label>
          <input className="form-input" value={form.valor} onChange={set('valor')} placeholder="0,00" type="number" inputMode="decimal" />
        </div>
        <div className="form-group">
          <label className="form-label">Sinal pago (R$)</label>
          <input className="form-input" value={form.sinal} onChange={set('sinal')} placeholder="0,00" type="number" inputMode="decimal" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Data da Sessão</label>
          <input className="form-input" value={form.data} onChange={set('data')} type="date" />
        </div>
        <div className="form-group">
          <label className="form-label">Horário</label>
          <input className="form-input" value={form.hora} onChange={set('hora')} type="time" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Status</label>
        <select className="form-input" value={form.status} onChange={set('status')}>
          <option value="orcamento">Orçamento enviado</option>
          <option value="sinal">Sinal pago</option>
          <option value="agendado">Sessão agendada</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Observações</label>
        <textarea className="form-input" value={form.obs} onChange={set('obs')} placeholder="Referências, detalhes especiais..." />
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button className="btn btn-secondary" style={{ flex: '0 0 auto', width: 'auto', padding: '14px 20px' }} onClick={closeDrawer}>
          Cancelar
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Salvar Cliente
        </button>
      </div>

      {editCliente && (
        <div style={{ marginTop: 10 }}>
          <button className="btn btn-danger" onClick={handleDelete}>
            🗑 Excluir Cliente
          </button>
        </div>
      )}
    </Drawer>
  );
}
