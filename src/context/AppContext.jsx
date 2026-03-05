import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { storageGet, storageSet, genId } from '../utils/storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [clientes, setClientes] = useState(() => {
    try {
      const raw = storageGet('ld_clientes');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // drawer: null | { type: 'cliente'|'detalhe'|'dia', data: any }
  const [drawer, setDrawer] = useState(null);

  // toast
  const [toast, setToast] = useState({ visible: false, msg: '', error: false });
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, error = false) => {
    clearTimeout(toastTimer.current);
    setToast({ visible: true, msg, error });
    toastTimer.current = setTimeout(() =>
      setToast(t => ({ ...t, visible: false })), 2500
    );
  }, []);

  const persistClientes = useCallback((updater) => {
    setClientes(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      storageSet('ld_clientes', JSON.stringify(next));
      return next;
    });
  }, []);

  const addCliente = useCallback((data) => {
    const entry = { ...data, id: genId(), criadoEm: Date.now() };
    persistClientes(prev => [entry, ...prev]);
    showToast('✓ Cliente adicionado!');
    return entry;
  }, [persistClientes, showToast]);

  const updateCliente = useCallback((id, data) => {
    persistClientes(prev =>
      prev.map(c => c.id === id ? { ...c, ...data } : c)
    );
    showToast('✓ Cliente atualizado!');
  }, [persistClientes, showToast]);

  const deleteCliente = useCallback((id) => {
    persistClientes(prev => prev.filter(c => c.id !== id));
    showToast('Cliente excluído.');
  }, [persistClientes, showToast]);

  const importClientes = useCallback((data) => {
    if (!Array.isArray(data)) return false;
    persistClientes(data);
    showToast(`✓ ${data.length} clientes importados!`);
    return true;
  }, [persistClientes, showToast]);

  const openDrawer = useCallback((type, data = null) => {
    setDrawer({ type, data });
  }, []);

  const closeDrawer = useCallback(() => setDrawer(null), []);

  return (
    <AppContext.Provider value={{
      clientes,
      addCliente,
      updateCliente,
      deleteCliente,
      importClientes,
      drawer,
      openDrawer,
      closeDrawer,
      toast,
      showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
