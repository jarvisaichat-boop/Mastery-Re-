export function MGButtonBase() {
  const streakCount = 7;

  return (
    <div style={{
      width: 390,
      height: 844,
      background: '#050810',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>

      {/* ── VARIATION LABEL ── */}
      <div style={{
        position: 'absolute', top: 12, left: 0, right: 0,
        textAlign: 'center', zIndex: 20,
        fontSize: 11, fontWeight: 700, letterSpacing: 2,
        color: '#eab308', textTransform: 'uppercase',
        textShadow: '0 0 8px rgba(234,179,8,0.6)',
      }}>
        Variation A — MG Button Base
      </div>

      {/* ══════════════════════════════════════
          STREAK BOARD HEADER
          Background now uses MG button's gold/amber
          ══════════════════════════════════════ */}
      <div style={{ position: 'relative', paddingTop: 36 }}>

        {/* Main golden ambient glow — MATCHED to MG button colour */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 110% 130% at 50% 0%, rgba(234,179,8,0.50) 0%, rgba(234,179,8,0.22) 35%, rgba(234,179,8,0.08) 65%, transparent 95%)',
          pointerEvents: 'none',
        }} />
        {/* Secondary glow behind number */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', width: 320, height: 320,
          background: 'radial-gradient(circle, rgba(234,179,8,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Inner content */}
        <div style={{ position: 'relative', padding: '42px 24px 0' }}>

          {/* Flame */}
          <div style={{
            position: 'absolute', top: 30, right: 32,
            fontSize: 110, lineHeight: 1,
            filter: 'drop-shadow(0 0 20px rgba(234,179,8,0.9)) drop-shadow(0 0 50px rgba(234,179,8,0.5))',
            userSelect: 'none',
          }}>🔥</div>

          {/* Number */}
          <div style={{
            fontSize: 100, fontWeight: 900, lineHeight: 1,
            letterSpacing: '-3px',
            color: '#fffbe6',
            textShadow: '0 0 30px rgba(234,179,8,0.95), 0 0 80px rgba(234,179,8,0.45)',
            marginBottom: 4, marginLeft: 24,
          }}>{streakCount}</div>

          {/* Label — gold tone */}
          <div style={{
            fontSize: 24, fontWeight: 700,
            color: '#eab308',
            textShadow: '0 0 14px rgba(234,179,8,0.75)',
            marginBottom: 20, marginLeft: 4,
          }}>day streak!</div>

          {/* Sessions Done card */}
          <div style={{
            borderRadius: 18, padding: '18px 20px',
            background: 'rgba(8,14,28,0.75)',
            border: '1.5px solid rgba(234,179,8,0.28)',
            boxShadow: '0 0 0 1px rgba(234,179,8,0.06), 0 8px 24px rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', gap: 16,
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(234,179,8,0.13)',
              border: '1.5px solid rgba(234,179,8,0.38)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>⚡</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,251,230,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>Sessions Done</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fffbe6', lineHeight: 1 }}>3</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,251,230,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>Best Streak</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fffbe6', lineHeight: 1 }}>12</div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
          background: 'linear-gradient(to bottom, transparent, rgba(5,8,16,0.8))',
          pointerEvents: 'none',
        }} />
      </div>

      {/* ── MIDDLE SPACER — habit rows hint ── */}
      <div style={{ flex: 1, padding: '24px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {['Morning Workout', 'Read 20 minutes', 'Cold shower'].map((name, i) => (
          <div key={i} style={{
            borderRadius: 14, padding: '14px 16px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: i === 0 ? 'rgba(234,179,8,0.3)' : 'rgba(255,255,255,0.06)',
              border: `2px solid ${i === 0 ? 'rgba(234,179,8,0.8)' : 'rgba(255,255,255,0.12)'}`,
              boxShadow: i === 0 ? '0 0 10px rgba(234,179,8,0.4)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14,
            }}>{i === 0 ? '✓' : ''}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: i === 0 ? 'rgba(255,251,230,0.9)' : 'rgba(255,255,255,0.55)' }}>{name}</div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════
          MG BUTTON — SAME golden base colour
          ══════════════════════════════════════ */}
      <div style={{
        position: 'relative', display: 'flex',
        justifyContent: 'center', alignItems: 'flex-end',
        paddingBottom: 0, overflow: 'hidden',
      }}>
        {/* Floor glow — matches button */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: 280, height: 60,
          background: 'radial-gradient(ellipse, rgba(234,179,8,0.40) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Semicircle button — MG button's own golden gradient (unchanged) */}
        <div style={{
          width: 160, height: 80,
          borderRadius: '80px 80px 0 0',
          background: 'linear-gradient(to right, #facc15, #eab308, #f97316)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 2,
          boxShadow: '0 -6px 32px rgba(234,179,8,0.55), 0 -2px 8px rgba(234,179,8,0.3)',
          cursor: 'pointer',
          position: 'relative', zIndex: 2,
        }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: '#000', letterSpacing: 1 }}>⚡ MG</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(0,0,0,0.65)', letterSpacing: 0.5 }}>MOMENTUM</span>
        </div>
      </div>

      {/* Colour chip key */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 16,
        padding: '10px 0 14px', background: 'rgba(0,0,0,0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, background: 'linear-gradient(to right, #facc15, #eab308)' }} />
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: 1 }}>SHARED BASE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, background: 'rgba(234,179,8,0.4)', border: '1px solid rgba(234,179,8,0.6)' }} />
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: 1 }}>GLOW #eab308</span>
        </div>
      </div>
    </div>
  );
}
