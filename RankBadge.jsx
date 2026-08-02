export default function RankBadge({ rank, size = 'md' }) {
  const dim = size === 'lg' ? 52 : size === 'sm' ? 30 : 40;
  const fontSize = size === 'lg' ? 20 : size === 'sm' ? 12 : 15;

  let tone = { ring: 'var(--color-border-strong)', bg: 'var(--color-surface)', text: 'var(--color-ink-soft)' };
  let label = '－';

  if (rank !== null && rank !== undefined && rank !== '') {
    label = String(rank);
    if (rank <= 3) {
      tone = { ring: 'var(--color-brass)', bg: 'var(--color-brass-soft)', text: 'var(--color-brass)' };
    } else if (rank <= 10) {
      tone = { ring: 'var(--color-good)', bg: 'var(--color-good-soft)', text: 'var(--color-good)' };
    } else {
      tone = { ring: 'var(--color-border-strong)', bg: 'var(--color-surface)', text: 'var(--color-ink)' };
    }
  } else {
    label = '圏外';
  }

  return (
    <div
      style={{
        width: dim,
        height: dim,
        borderRadius: '50%',
        border: `2px solid ${tone.ring}`,
        background: tone.bg,
        color: tone.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: rank !== null && rank !== undefined && rank !== '' ? fontSize : fontSize - 4,
        flexShrink: 0
      }}
      title={rank === null || rank === undefined || rank === '' ? '上位20件に圏外' : `${rank}位`}
    >
      {label}
    </div>
  );
}
