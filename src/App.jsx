import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Nav from './components/Nav';
import Dashboard from './components/pages/Dashboard';
import Clientes from './components/pages/Clientes';
import Agenda from './components/pages/Agenda';
import Financeiro from './components/pages/Financeiro';
import ClienteDrawer from './components/drawers/ClienteDrawer';
import DetalheDrawer from './components/drawers/DetalheDrawer';
import DiaDrawer from './components/drawers/DiaDrawer';
import Toast from './components/ui/Toast';

const pages = { dash: Dashboard, clientes: Clientes, agenda: Agenda, finance: Financeiro };

function AppShell() {
  const [activePage, setActivePage] = useState('dash');
  const { openDrawer } = useApp();

  const PageComponent = pages[activePage];
  const showFab = activePage === 'dash' || activePage === 'clientes';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      <Header />

      {/* Page content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            padding: '20px calc(20px + var(--sar)) 100px calc(20px + var(--sal))',
          }}
        >
          <PageComponent />
        </div>
      </div>

      <Nav active={activePage} onNav={setActivePage} />

      {/* FAB */}
      {showFab && (
        <button
          onClick={() => openDrawer('cliente', null)}
          style={{
            position: 'fixed',
            bottom: 'calc(80px + var(--sab))',
            right: 'calc(20px + var(--sar))',
            width: 56,
            height: 56,
            background: 'var(--gold)',
            border: 'none',
            borderRadius: '50%',
            color: 'var(--bg)',
            fontSize: 24,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(201,169,110,0.4)',
            zIndex: 10,
            WebkitTapHighlightColor: 'transparent',
          }}
          title="Novo cliente"
        >
          ＋
        </button>
      )}

      {/* Drawers */}
      <ClienteDrawer />
      <DetalheDrawer />
      <DiaDrawer />

      {/* Toast */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
