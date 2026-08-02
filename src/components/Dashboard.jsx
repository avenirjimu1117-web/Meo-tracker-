import { useEffect, useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';
import { getHistory, runCheckNow } from '../api';
import RankBadge from './RankBadge';

const LINE_COLORS = ['#9c7a3c', '#3f6b52', '#a34638', '#6b6560', '#7a8fa6', '#8a6fa0'];

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function Dashboard({ settings }) {
  const { stores, keywords } = settings;
  const [storeId, setStoreId] = useState(stores[0]?.id);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getHistory({ storeId, days: 90 })
      .then((data) => {
        if (!cancelled) setHistory(data.history || []);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [storeId]);

  const storeKeywords = useMemo(
    () => keywords.filter((k) => k.storeId === storeId && k.enabled !== false),
    [keywords, storeId]
  );

  const latestByKeyword = useMemo(() => {
    const map = {};
    for (const row of history) {
      const prev = map[row.keyword];
      if (!prev || new Date(row.datetime) > new Date(prev.datetime)) {
        map[row.keyword] = row;
      }
    }
    return map;
  }, [history]);

  const chartData = useMemo(() => {
    const byDate = {};
    for (const row of history) {
      const day = formatDate(row.datetime);
      if (!byDate[day]) byDate[day] = { date: day };
      byDate[day][row.keyword] = row.rank ?? null;
    }
    return Object.values(byDate).sort((a, b) => (a.date > b.date ? 1 : -1));
  }, [history]);

  const handleCheckNow = async () => {
    setChecking(true);
    setNotice('');
    try {
      await runCheckNow();
      setNotice('チェックを開始しました。数分後に「更新」ボタンで結果を確認してください。');
    } catch (e) {
      setNotice(e.message || '実行に失敗しました');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 20 }}>
        {stores.map((s) => {
          const active = s.id === storeId;
          return (
            <button
              key={s.id}
              onClick={() => setStoreId(s.id)}
              style={{
                whiteSpace: 'nowrap',
                padding: '9px 16px',
                borderRadius: 999,
                border: `1px solid ${active ? 'var(--color-brass)' : 'var(--color-border-strong)'}`,
                background: active ? 'var(--color-brass-soft)' : 'var(--color-surface)',
                color: active ? 'var(--color-brass)' : 'var(--color-ink)',
                fontWeight: active ? 700 : 400,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              {s.name}
              <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--color-ink-soft)' }}>{s.area}</span>
            </button>
          );
        })}
      </div>

      <section
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          padding: 18,
          marginBottom: 20
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>
            現在の順位
          </h2>
          <button
            onClick={handleCheckNow}
            disabled={checking}
            style={{
              fontSize: 12,
              padding: '7px 12px',
              borderRadius: 8,
              border: '1px solid var(--color-brass)',
              background: checking ? 'var(--color-brass-soft)' : 'transparent',
              color: 'var(--color-brass)',
              cursor: checking ? 'default' : 'pointer'
            }}
          >
            {checking ? '実行中…' : '今すぐチェック'}
          </button>
        </div>

        {notice && (
          <p style={{ fontSize: 12, color: 'var(--color-ink-soft)', marginTop: -6, marginBottom: 12 }}>{notice}</p>
        )}

        {loading ? (
          <p style={{ fontSize: 13, color: 'var(--color-ink-soft)' }}>読み込み中…</p>
        ) : storeKeywords.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--color-ink-soft)' }}>
            この店舗に有効なキーワードがありません。「キーワード」タブから追加してください。
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {storeKeywords.map((kw) => {
              const latest = latestByKeyword[kw.keyword];
              return (
                <div
                  key={kw.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '10px 4px',
                    borderBottom: '1px solid var(--color-border)'
                  }}
                >
                  <RankBadge rank={latest ? latest.rank : null} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{kw.keyword}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--color-ink-soft)' }}>
                      {latest ? `最終チェック: ${formatDate(latest.datetime)} ・ ${latest.status}` : 'まだ計測データがありません'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          padding: 18
        }}
      >
        <h2 style={{ margin: '0 0 14px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>
          順位の推移(直近90日)
        </h2>
        {chartData.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--color-ink-soft)' }}>推移を表示するにはデータが必要です。</p>
        ) : (
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b6560' }} axisLine={{ stroke: '#e6e2d9' }} tickLine={false} />
                <YAxis
                  reversed
                  domain={[1, 20]}
                  tick={{ fontSize: 11, fill: '#6b6560' }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e6e2d9' }}
                  labelStyle={{ fontWeight: 700 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {storeKeywords.map((kw, i) => (
                  <Line
                    key={kw.id}
                    type="monotone"
                    dataKey={kw.keyword}
                    stroke={LINE_COLORS[i % LINE_COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 2.5 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
}
