import { useState } from 'react';
import { MapPin, Check } from 'lucide-react';
import { updateStore } from '../api';

export default function StoreSettings({ settings, onChanged }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);

  const startEdit = (store) => {
    setEditingId(store.id);
    setDraft({ area: store.area, address: store.address, gbpName: store.gbpName });
  };

  const save = async (storeId) => {
    setSaving(true);
    try {
      await updateStore(storeId, draft);
      setEditingId(null);
      onChanged();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', marginTop: 0, marginBottom: 18 }}>
        住所を変更すると、次回のチェック前に緯度経度が自動で再取得されます(GAS側で geocodeStores
        を一度実行してください)。
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {settings.stores.map((store) => {
          const isEditing = editingId === store.id;
          return (
            <div
              key={store.id}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-card)',
                padding: 16
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>
                    {store.name}
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--color-ink-soft)' }}>
                    {store.gbpName}
                  </p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => startEdit(store)}
                    style={{
                      fontSize: 12,
                      padding: '6px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--color-border-strong)',
                      background: 'transparent',
                      color: 'var(--color-ink)',
                      cursor: 'pointer'
                    }}
                  >
                    編集
                  </button>
                )}
              </div>

              {isEditing ? (
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label style={fieldLabel}>
                    エリア名
                    <input
                      value={draft.area}
                      onChange={(e) => setDraft((d) => ({ ...d, area: e.target.value }))}
                      style={inputStyle}
                    />
                  </label>
                  <label style={fieldLabel}>
                    住所
                    <input
                      value={draft.address}
                      onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))}
                      style={inputStyle}
                    />
                  </label>
                  <label style={fieldLabel}>
                    Googleビジネス名(検索結果での照合に使用)
                    <input
                      value={draft.gbpName}
                      onChange={(e) => setDraft((d) => ({ ...d, gbpName: e.target.value }))}
                      style={inputStyle}
                    />
                  </label>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <button
                      onClick={() => save(store.id)}
                      disabled={saving}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 13,
                        padding: '8px 14px',
                        borderRadius: 8,
                        border: '1px solid var(--color-good)',
                        background: 'var(--color-good-soft)',
                        color: 'var(--color-good)',
                        cursor: 'pointer'
                      }}
                    >
                      <Check size={14} />
                      保存
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        fontSize: 13,
                        padding: '8px 14px',
                        borderRadius: 8,
                        border: '1px solid var(--color-border-strong)',
                        background: 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 13, color: 'var(--color-ink-soft)' }}>
                  <MapPin size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span>
                    {store.area} ・ {store.address}
                    {store.lat && store.lng ? '' : '（緯度経度未取得）'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const fieldLabel = { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--color-ink-soft)' };
const inputStyle = {
  padding: '9px 10px',
  borderRadius: 8,
  border: '1px solid var(--color-border-strong)',
  fontSize: 14,
  color: 'var(--color-ink)',
  background: 'var(--color-bg)'
};
