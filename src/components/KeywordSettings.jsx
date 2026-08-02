import { useState } from 'react';
import { Plus } from 'lucide-react';
import { addKeyword, toggleKeyword } from '../api';

export default function KeywordSettings({ settings, onChanged }) {
  const [newKeyword, setNewKeyword] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [adding, setAdding] = useState(null);

  const handleToggle = async (kw) => {
    setBusyId(kw.id);
    try {
      await toggleKeyword(kw.id, !kw.enabled);
      onChanged();
    } finally {
      setBusyId(null);
    }
  };

  const handleAdd = async (storeId) => {
    const value = (newKeyword[storeId] || '').trim();
    if (!value) return;
    setAdding(storeId);
    try {
      await addKeyword(storeId, value);
      setNewKeyword((s) => ({ ...s, [storeId]: '' }));
      onChanged();
    } finally {
      setAdding(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {settings.stores.map((store) => {
        const kws = settings.keywords.filter((k) => k.storeId === store.id);
        return (
          <section
            key={store.id}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
              padding: 16
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>
                {store.name}
              </h3>
              <span style={{ fontSize: 11, color: 'var(--color-ink-soft)' }}>{store.area}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {kws.length === 0 && (
                <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', margin: 0 }}>
                  まだキーワードがありません。
                </p>
              )}
              {kws.map((kw) => (
                <label
                  key={kw.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    padding: '9px 4px',
                    borderBottom: '1px solid var(--color-border)',
                    fontSize: 14,
                    color: kw.enabled === false ? 'var(--color-ink-soft)' : 'var(--color-ink)',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ textDecoration: kw.enabled === false ? 'line-through' : 'none' }}>
                    {kw.keyword}
                  </span>
                  <input
                    type="checkbox"
                    checked={kw.enabled !== false}
                    disabled={busyId === kw.id}
                    onChange={() => handleToggle(kw)}
                    style={{ width: 18, height: 18, accentColor: '#9c7a3c' }}
                  />
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                placeholder="新しいキーワードを追加"
                value={newKeyword[store.id] || ''}
                onChange={(e) => setNewKeyword((s) => ({ ...s, [store.id]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd(store.id)}
                style={{
                  flex: 1,
                  padding: '9px 10px',
                  borderRadius: 8,
                  border: '1px solid var(--color-border-strong)',
                  fontSize: 14,
                  background: 'var(--color-bg)'
                }}
              />
              <button
                onClick={() => handleAdd(store.id)}
                disabled={adding === store.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '9px 14px',
                  borderRadius: 8,
                  border: '1px solid var(--color-brass)',
                  background: 'var(--color-brass-soft)',
                  color: 'var(--color-brass)',
                  fontSize: 13,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <Plus size={14} />
                追加
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
