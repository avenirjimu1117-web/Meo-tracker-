import { useEffect, useState, useCallback } from 'react';
import { LayoutGrid, Store, Tags, RefreshCw } from 'lucide-react';
import { getSettings } from './api';
import Dashboard from './components/Dashboard';
import StoreSettings from './components/StoreSettings';
import KeywordSettings from './components/KeywordSettings';

const TABS = [
  { id: 'dashboard', label: 'ダッシュボード', icon: LayoutGrid },
  { id: 'stores', label: 'エリア設定', icon: Store },
  { id: 'keywords', label: 'キーワード', icon: Tags }
];

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (e) {
      setError(e.message || '読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', maxWidth: 960, margin: '0 auto' }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, letterSpacing: '0.14em', color: 'var(--color-ink-soft)' }}>
              ARBRE ET CHIMIE GROUP
            </p>
            <h1
              style={{
                margin: '2px 0 0',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 22,
                letterSpacing: '0.02em'
              }}
            >
              MEO順位トラッカー
            </h1>
          </div>
          <button
            onClick={reload}
            disabled={loading}
            aria-label="再読み込み"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              border: '1px solid var(--color-border-strong)',
              background: 'transparent',
              borderRadius: 999,
              padding: '8px 14px',
              fontSize: 13,
              color: 'var(--color-ink-soft)',
              cursor: loading ? 'default' : 'pointer'
            }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            更新
          </button>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 960, margin: '0 auto', width: '100%', padding: '20px 16px 96px' }}>
        {error && (
          <div
            style={{
              background: 'var(--color-bad-soft)',
              color: 'var(--color-bad)',
              border: '1px solid var(--color-bad)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              marginBottom: 16,
              fontSize: 14
            }}
          >
            {error}
          </div>
        )}

        {loading && !settings ? (
          <p style={{ color: 'var(--color-ink-soft)', fontSize: 14 }}>読み込み中…</p>
        ) : settings ? (
          <>
            {tab === 'dashboard' && <Dashboard settings={settings} />}
            {tab === 'stores' && <StoreSettings settings={settings} onChanged={reload} />}
            {tab === 'keywords' && <KeywordSettings settings={settings} onChanged={reload} />}
          </>
        ) : null}
      </main>

      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', width: '100%', maxWidth: 960 }}>
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  padding: '10px 0 12px',
                  background: 'transparent',
                  border: 'none',
                  color: active ? 'var(--color-brass)' : 'var(--color-ink-soft)',
                  cursor: 'pointer'
                }}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                <span style={{ fontSize: 11, fontWeight: active ? 700 : 400 }}>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <style>{`
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
