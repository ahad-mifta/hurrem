import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Images ──────────────────────────────────────────────────────────────────
const U = (id: string, w = 1920, h = 1080) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=85`

const IMG = {
  hero:  U('1732081697693-7c6569981102'),
  coast: U('1723143036444-b76835788083'),
  story: U('1742236467666-f516d9e383f5', 1400, 1000),
  dome:  U('1635750768877-8bc31c76a125'),
  // Architecture venues
  a1: U('1655516433028-9e0e1599cf8b', 1400, 900),
  a2: U('1773414026196-0194721e803e', 1400, 900),
  a3: U('1786018120871-fc2c56e308ee', 1400, 900),
  a4: U('1638813893006-20622c05b4f4', 1400, 900),
  a5: U('1769149255670-aa0ad6428dd6', 1400, 900),
  a6: U('1625259566209-8c59614a28fa', 1400, 900),
  // Facility categories
  fDining:       U('1687648431656-da99da578d50'),
  fBanquet:      U('1780542900375-0cf459e38fbb'),
  fPools:        U('1769149255670-aa0ad6428dd6'),
  fWellness:     U('1696841212541-449ca29397cc'),
  fFamily:       U('1602002418816-5c0aeef426aa'),
  fLibrary:      U('1782530707382-fdb15bf93789'),
  fShopping:     U('1742236467666-f516d9e383f5', 1400, 900),
  fFaith:        U('1773414026196-0194721e803e', 1400, 900),
  fBeach:        U('1723143036444-b76835788083'),
  fPresidential: U('1731336478850-6bce7235e320'),
}

const MENU_SLIDES = [
  U('1732081697693-7c6569981102'),
  U('1655516433028-9e0e1599cf8b', 1400, 900),
  U('1687648431656-da99da578d50'),
  U('1769149255670-aa0ad6428dd6', 1400, 900),
  U('1635750768877-8bc31c76a125'),
  U('1723143036444-b76835788083'),
]

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  imperialBlack: '#0A0807',
  palaceBlack:   '#11100E',
  crimson:       '#5E0F1A',
  gold:          '#B38A3E',
  champagne:     '#D4B56A',
  ivory:         '#E8E0D2',
  sand:          '#A99D8B',
  brass:         '#725C31',
}
const CINZEL    = 'Cinzel, serif'
const PLAYFAIR  = 'Playfair Display, serif'
const CORMORANT = 'Cormorant Garamond, serif'
const JOST      = 'Jost, sans-serif'
const EASE      = 'cubic-bezier(0.16, 1, 0.3, 1)'

// ─── Keyframes ────────────────────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes sealIn  { from{opacity:0;transform:scale(.82) rotate(-8deg)}to{opacity:1;transform:scale(1) rotate(0)} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)} }
  @keyframes slideRight { from{opacity:0;transform:translateX(50px)}to{opacity:1;transform:translateX(0)} }
  @keyframes slideLeft  { from{opacity:0;transform:translateX(-50px)}to{opacity:1;transform:translateX(0)} }
  @keyframes drawLine   { from{stroke-dashoffset:600}to{stroke-dashoffset:0} }
  @keyframes shimmer    { 0%,100%{opacity:.35}50%{opacity:.8} }
  @keyframes menuIn     { from{opacity:0}to{opacity:1} }
  @keyframes fadeIn     { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
  @keyframes progressPulse { 0%,100%{opacity:.6}50%{opacity:1} }
`

// ─── Hooks ───────────────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(1440)
  useEffect(() => {
    setW(window.innerWidth)
    const fn = () => setW(window.innerWidth)
    window.addEventListener('resize', fn, { passive: true })
    return () => window.removeEventListener('resize', fn)
  }, [])
  return w
}

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ─── Primitives ───────────────────────────────────────────────────────────────
function ImperialSeal({ size = 120, opacity = 1 }: { size?: number; opacity?: number }) {
  const dots = Array.from({ length: 36 }, (_, i) => {
    const a = (i * 10 * Math.PI) / 180
    return { cx: 60 + 53 * Math.cos(a), cy: 60 + 53 * Math.sin(a) }
  })
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" style={{ opacity }}>
      <circle cx="60" cy="60" r="56" stroke={C.gold} strokeWidth="0.7" opacity="0.5" />
      <circle cx="60" cy="60" r="50" stroke={C.gold} strokeWidth="0.4" opacity="0.3" />
      {dots.map((d, i) => <circle key={i} cx={d.cx} cy={d.cy} r="0.9" fill={C.gold} opacity="0.4" />)}
      <path d="M60 28 C56 34 52 40 52 48 C52 55 56 60 60 62 C64 60 68 55 68 48 C68 40 64 34 60 28Z"
        stroke={C.gold} strokeWidth="0.8" fill="none" opacity="0.55" />
      <path d="M47 50 C42 46 38 44 36 46 C34 50 37 56 42 58 C47 60 54 59 58 56"
        stroke={C.gold} strokeWidth="0.6" fill="none" opacity="0.4" />
      <path d="M73 50 C78 46 82 44 84 46 C86 50 83 56 78 58 C73 60 66 59 62 56"
        stroke={C.gold} strokeWidth="0.6" fill="none" opacity="0.4" />
      <path d="M60 72 L63 79 L60 86 L57 79 Z" stroke={C.gold} strokeWidth="0.6" fill="none" opacity="0.4" />
      <circle cx="60" cy="68" r="2" stroke={C.gold} strokeWidth="0.6" fill="none" opacity="0.4" />
    </svg>
  )
}

function ArchBorder() {
  return (
    <svg viewBox="0 0 340 520" fill="none" style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
      <path d="M12 518 L12 222 Q12 12 170 12 Q328 12 328 222 L328 518"
        stroke={C.gold} strokeWidth="0.7" opacity="0.32"
        strokeDasharray="600" style={{ animation: 'drawLine 2.5s 0.5s ease both' }} />
      <path d="M22 518 L22 228 Q22 24 170 24 Q318 24 318 228 L318 518"
        stroke={C.gold} strokeWidth="0.35" opacity="0.16" />
      <circle cx="12" cy="518" r="3" fill={C.gold} opacity="0.35" />
      <circle cx="328" cy="518" r="3" fill={C.gold} opacity="0.35" />
      <path d="M162 22 L170 8 L178 22" stroke={C.gold} strokeWidth="0.6" fill="none" opacity="0.35" />
    </svg>
  )
}

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const s: React.CSSProperties = {
    position: 'absolute', width: 36, height: 36,
    borderColor: 'rgba(179,138,62,0.38)', borderStyle: 'solid', borderWidth: 0,
    ...(pos === 'tl' ? { top: 24, left: 24, borderTopWidth: 1, borderLeftWidth: 1 } : {}),
    ...(pos === 'tr' ? { top: 24, right: 24, borderTopWidth: 1, borderRightWidth: 1 } : {}),
    ...(pos === 'bl' ? { bottom: 24, left: 24, borderBottomWidth: 1, borderLeftWidth: 1 } : {}),
    ...(pos === 'br' ? { bottom: 24, right: 24, borderBottomWidth: 1, borderRightWidth: 1 } : {}),
  }
  return <div style={s} />
}

function GoldLine({ w = 48 }: { w?: number }) {
  return <div style={{ width: w, height: 1, background: C.gold, opacity: 0.38 }} />
}

// ═════════════════════════════════════════════════════════════════════════════
// LOADING SCREEN
// ═════════════════════════════════════════════════════════════════════════════
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [fade, setFade] = useState(false)
  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 2200)
    const t2 = setTimeout(() => onComplete(), 3000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onComplete])
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: C.imperialBlack,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28,
      transition: `opacity 0.8s ${EASE}`, opacity: fade ? 0 : 1, pointerEvents: fade ? 'none' : 'all',
    }}>
      <div style={{ width: 130, height: 130, borderRadius: '50%', overflow: 'hidden',
        border: '1px solid rgba(179,138,62,0.3)', boxShadow: '0 0 60px rgba(179,138,62,0.08)',
        animation: `sealIn 1.4s ${EASE} both`, flexShrink: 0 }}>
        <img src="/imports/Hurrem Logo_Favicon.png" alt="Hurrem Palace" style={{ width: '100%', height: '100%', objectFit: 'scale-down' }} />
      </div>
      <div style={{ textAlign: 'center', animation: `fadeUp 1.2s 0.5s ${EASE} both`, opacity: 0 }}>
        <div style={{ fontFamily: CINZEL, fontSize: 25, letterSpacing: '0.35em', color: C.champagne, fontWeight: 700, marginBottom: 10 }}>
          HURREM PALACE
        </div>
        <div style={{ fontFamily: CORMORANT, fontSize: 18, letterSpacing: '0.18em', color: C.sand, fontStyle: 'italic' }}>
          An Ottoman Legacy on Bangladesh's Coast
        </div>
      </div>
      <div style={{ animation: 'shimmer 2s 0.8s infinite', opacity: 0.35 }}>
        <ImperialSeal size={52} opacity={0.6} />
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═════════════════════════════════════════════════════════════════════════════
function MenuImageSlider() {
  const [slide, setSlide] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % MENU_SLIDES.length), 3800)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {MENU_SLIDES.map((src, i) => (
        <div key={src} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.55) saturate(0.7)',
          transition: 'opacity 1.8s ease',
          opacity: slide === i ? 1 : 0,
        }} />
      ))}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, transparent 60%, rgba(10,8,7,0.6) 100%)' }} />
      {/* Slide dots */}
      <div style={{ position: 'absolute', bottom: 36, right: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {MENU_SLIDES.map((_, i) => (
          <div key={i} style={{ width: 2, height: slide === i ? 22 : 6, backgroundColor: slide === i ? C.champagne : C.brass, transition: 'height 0.5s ease, background-color 0.5s ease', borderRadius: 1 }} />
        ))}
      </div>
    </div>
  )
}

function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const w = useWindowWidth()
  const isMobile = w < 768

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
        padding: isMobile ? '18px 20px' : '26px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: `background 0.9s ${EASE}, border-color 0.9s ease`,
        backgroundColor: scrolled ? 'rgba(10,8,7,0.93)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(114,92,49,0.22)' : '1px solid transparent',
      }}>
        <button onClick={() => setMenuOpen(true)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 10, padding: 0,
        }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ width: 22, height: 1, background: C.gold, display: 'block' }} />
            <span style={{ width: 14, height: 1, background: C.gold, display: 'block' }} />
          </span>
          {!isMobile && <span style={{ fontFamily: JOST, fontSize: 10, letterSpacing: '0.3em', color: C.sand }}>MENU</span>}
        </button>

        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <img src="/imports/HLogo_v.png" alt="Hurrem Palace Logo" style={{ height: isMobile ? 24 : 32, filter: 'brightness(0) saturate(100%) invert(83%) sepia(23%) saturate(1036%) hue-rotate(328deg) brightness(88%) contrast(83%)' }} />
          
        </div>

        <a href="#contact" style={{
          fontFamily: JOST, fontSize: 10, letterSpacing: '0.25em', color: C.sand,
          textDecoration: 'none', paddingBottom: 3, borderBottom: '1px solid rgba(179,138,62,0.35)',
          transition: 'color 0.3s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = C.champagne)}
          onMouseLeave={e => (e.currentTarget.style.color = C.sand)}
        >
          CONTACT
        </a>
      </nav>

      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 600,
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          animation: `menuIn 0.45s ${EASE}`,
        }}>
          {/* Left panel — dark, navigation */}
          <div style={{ backgroundColor: C.imperialBlack, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: isMobile ? '100px 36px 60px' : '0 0 0 80px' }}>
            <button onClick={() => setMenuOpen(false)} style={{
              position: 'absolute', top: isMobile ? 20 : 28, right: isMobile ? 20 : 36,
              fontFamily: JOST, fontSize: 10, letterSpacing: '0.3em', color: C.sand,
              background: 'none', border: 'none', cursor: 'pointer',
            }}>CLOSE ✕</button>

            <div style={{ position: 'absolute', top: isMobile ? 20 : 28, left: isMobile ? 20 : 'auto', ...(isMobile ? {} : { left: 80 }) }}>
              <img src="/imports/HLogo_v.png" alt="Hurrem Palace Logo" style={{ height: isMobile ? 24 : 32, filter: 'brightness(0) saturate(100%) invert(83%) sepia(23%) saturate(1036%) hue-rotate(328deg) brightness(88%) contrast(83%)' }} />
              <img src="/imports/Hurrem_Logo_Final.png" alt="Hurrem Palace Logo" style={{ height: isMobile ? 24 : 32, filter: 'brightness(0) saturate(100%) invert(83%) sepia(23%) saturate(1036%) hue-rotate(328deg) brightness(88%) contrast(83%)' }} />
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['HOME', 'ABOUT', 'ARCHITECTURE', 'INVESTMENT', 'CONTACT'].map((item, i) => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{
                  fontFamily: CINZEL, fontSize: isMobile ? 'clamp(22px,6vw,36px)' : 'clamp(28px,3.2vw,48px)',
                  letterSpacing: '0.12em', color: C.ivory, textDecoration: 'none',
                  padding: '8px 0', lineHeight: 1.15, transition: 'color 0.3s',
                  animation: `fadeUp 0.6s ${i * 0.07 + 0.1}s ${EASE} both`, opacity: 0,
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.champagne)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.ivory)}
                >{item}</a>
              ))}
            </nav>

            <div style={{ marginTop: 48, animation: `fadeUp 0.6s 0.5s ${EASE} both`, opacity: 0 }}>
              <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${C.gold}, transparent)`, marginBottom: 18, opacity: 0.4 }} />
              <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.35em', color: C.brass, marginBottom: 10 }}>LOCATION</div>
              <div style={{ fontFamily: CINZEL, fontSize: 12, letterSpacing: '0.16em', color: C.sand, lineHeight: 2 }}>
                SHAMUK BEACH<br />COX'S BAZAR · BANGLADESH
              </div>
              <div style={{ marginTop: 20, fontFamily: CORMORANT, fontSize: 14, fontStyle: 'italic', color: C.brass }}>2027 — 2032</div>
            </div>
          </div>

          {/* Right panel — image slider (desktop only) */}
          {!isMobile && (
            <div style={{ position: 'relative', overflow: 'hidden', animation: `fadeIn 0.7s 0.15s ${EASE} both`, opacity: 0 }}>
              <MenuImageSlider />
              {/* Overlay label */}
              <div style={{ position: 'absolute', top: 44, right: 44, textAlign: 'right', pointerEvents: 'none' }}>
                <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.35em', color: C.champagne, opacity: 0.6 }}>THE PALACE</div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// HERO
// ═════════════════════════════════════════════════════════════════════════════
function HeroSection() {
  const [scrollY, setScrollY] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const w = useWindowWidth()
  const isMobile = w < 768

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.playbackRate = 0.45
  }, [])

  return (
    <section id="home" style={{ position: 'relative', height: '100svh', overflow: 'hidden', backgroundColor: C.imperialBlack }}>
      <div style={{
        position: 'absolute', inset: '-8%',
        transform: `scale(${1 + scrollY * 0.00025}) translateY(${scrollY * 0.28}px)`,
        willChange: 'transform',
      }}>
        <video
          ref={videoRef}
          src="/imports/HLogo_v.png"
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65) saturate(0.75)' }}
        />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,8,7,0.25) 0%, rgba(10,8,7,0.05) 35%, rgba(10,8,7,0.55) 75%, rgba(10,8,7,0.95) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(15, 13, 13, 0.35) 100%)' }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='72' height='72' viewBox='0 0 72 72' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M36 4 L68 36 L36 68 L4 36 Z' stroke='%23B38A3E' stroke-width='0.35' fill='none' opacity='0.18'/%3E%3Cpath d='M36 18 L54 36 L36 54 L18 36 Z' stroke='%23B38A3E' stroke-width='0.25' fill='none' opacity='0.1'/%3E%3C/svg%3E")`,
        backgroundSize: '72px 72px', opacity: 0.7,
      }} />

      {/* Arch frame */}
      {!isMobile && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: `translate(-50%, -50%) translateY(${-scrollY * 0.08}px)`,
          width: 'clamp(260px, 30vw, 420px)', height: 'clamp(380px, 52vh, 640px)',
          pointerEvents: 'none',
        }}>
          <ArchBorder />
        </div>
      )}

      {/* Main typography */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `translate(-50%, -50%) translateY(${-scrollY * 0.14}px)`,
        textAlign: 'center', width: '100%', padding: '0 24px', pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: CINZEL, fontWeight: 700,
          fontSize: isMobile ? 'clamp(22px, 7vw, 36px)' : 'clamp(32px, 5.5vw, 80px)',
          letterSpacing: isMobile ? '0.18em' : '0.28em', color: C.ivory, lineHeight: 1,
          marginBottom: 20, textShadow: '0 4px 60px rgba(0,0,0,0.7)',
          animation: `fadeUp 1.4s 0.3s ${EASE} both`, opacity: 0,
        }}>HURREM PALACE</div>
        <div style={{
          fontFamily: CORMORANT, fontSize: isMobile ? 14 : 'clamp(15px, 2vw, 22px)',
          fontStyle: 'italic', color: C.sand, letterSpacing: '0.12em', lineHeight: 1.9,
          animation: `fadeUp 1.4s 0.6s ${EASE} both`, opacity: 0,
        }}>
          An Ottoman Legacy<br />on Bangladesh's Coast
        </div>
        <div style={{
          marginTop: 24, fontFamily: JOST, fontSize: isMobile ? 10 : 11,
          letterSpacing: '0.35em', color: C.brass,
          animation: `fadeUp 1.4s 0.9s ${EASE} both`, opacity: 0,
        }}>2027 — 2032</div>
      </div>

      {/* Bottom left */}
      {!isMobile && (
        <div style={{ position: 'absolute', bottom: 44, left: 48, animation: `fadeUp 1.2s 1.1s ${EASE} both`, opacity: 0, pointerEvents: 'none' }}>
          <div style={{ width: 1, height: 44, background: `linear-gradient(to bottom, ${C.gold}, transparent)`, marginBottom: 14, opacity: 0.5 }} />
          <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.35em', color: C.brass, marginBottom: 5 }}>LOCATION</div>
          <div style={{ fontFamily: CINZEL, fontSize: 12, letterSpacing: '0.2em', color: C.sand, lineHeight: 1.9 }}>
            SHAMUK BEACH<br />COX'S BAZAR
          </div>
          <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.3em', color: C.brass, marginTop: 4 }}>BANGLADESH</div>
        </div>
      )}

      {/* Bottom right */}
      <div style={{
        position: 'absolute', bottom: isMobile ? 36 : 44, right: isMobile ? 24 : 48,
        textAlign: 'right', animation: `fadeUp 1.2s 1.3s ${EASE} both`, opacity: 0,
      }}>
        {!isMobile && <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.3em', color: C.sand, marginBottom: 12 }}>DISCOVER THE PALACE</div>}
        <div style={{ width: 1, height: 44, background: `linear-gradient(to bottom, ${C.gold}, transparent)`, marginLeft: 'auto', opacity: 0.6, animation: 'shimmer 2.5s 2s infinite' }} />
      </div>

      {/* Vertical label */}
      {!isMobile && (
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          fontFamily: JOST, fontSize: 9, letterSpacing: '0.3em', color: C.brass,
          writingMode: 'vertical-rl', paddingBottom: 44, pointerEvents: 'none',
          animation: `fadeUp 1.2s 1.5s ${EASE} both`, opacity: 0,
        }}>SCROLL TO ENTER</div>
      )}

      {/* Mobile location badge */}
      {isMobile && (
        <div style={{
          position: 'absolute', bottom: 36, left: 24,
          animation: `fadeUp 1.2s 1.1s ${EASE} both`, opacity: 0, pointerEvents: 'none',
        }}>
          <div style={{ fontFamily: CINZEL, fontSize: 10, letterSpacing: '0.18em', color: C.sand }}>
            SHAMUK BEACH · COX'S BAZAR
          </div>
        </div>
      )}
    </section>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// MANIFESTO
// ═════════════════════════════════════════════════════════════════════════════
function ManifestoSection() {
  const { ref, visible } = useReveal(0.1)
  const sectionRef = useRef<HTMLElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const w = useWindowWidth()
  const isMobile = w < 768

  useEffect(() => {
    const fn = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when section top hits viewport bottom, 1 when section bottom leaves viewport top
      const total = el.offsetHeight + vh
      const scrolled = vh - rect.top
      setScrollProgress(Math.max(0, Math.min(1, scrolled / total)))
    }
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // zoom starts at 1.18 (zoomed in) and eases out to 1.0 as user scrolls through
  const scale = 1.18 - scrollProgress * 0.18

  const lines = [
    { text: 'NOT A HOTEL.', italic: true, dim: true },
    { text: 'A PALACE.',    italic: false, dim: false },
    { text: 'A DESTINATION.', italic: false, dim: false },
    { text: 'A LEGACY.',   italic: false, dim: false },
  ]

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '80px 28px' : '120px 40px', overflow: 'hidden' }}
    >
      {/* Background — hero image zooming out as you scroll */}
      <div style={{
        position: 'absolute', inset: '-6%',
        backgroundImage: `url(${IMG.hero})`, backgroundSize: 'cover', backgroundPosition: 'center 35%',
        transform: `scale(${scale})`,
        transition: 'transform 0.1s linear',
        willChange: 'transform',
        filter: 'brightness(0.22) saturate(0.55)',
      }} />
      {/* Dark gradient overlay for readability */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(10,8,7,0.45) 0%, rgba(10,8,7,0.82) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,8,7,0.65) 0%, transparent 30%, transparent 70%, rgba(10,8,7,0.75) 100%)' }} />

      {/* Content */}
      <div ref={ref as React.RefObject<HTMLDivElement>} style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 920 }}>
        <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.5em', color: C.gold, marginBottom: isMobile ? 40 : 64, transition: `opacity 1s ${EASE}`, opacity: visible ? 1 : 0 }}>
          THE PALACE IS COMING
        </div>
        {lines.map((line, i) => (
          <div key={line.text} style={{
            fontFamily: PLAYFAIR,
            fontSize: isMobile ? 'clamp(28px, 9vw, 52px)' : 'clamp(36px, 6.5vw, 96px)',
            color: line.dim ? C.sand : C.ivory,
            fontStyle: line.italic ? 'italic' : 'normal',
            fontWeight: line.italic ? 400 : 700,
            lineHeight: 1.12,
            transition: `opacity 1.1s ${i * 0.18}s ${EASE}, transform 1.1s ${i * 0.18}s ${EASE}`,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(44px)',
          }}>{line.text}</div>
        ))}
        <div style={{ margin: '48px auto 0', width: 1, height: 60, background: `linear-gradient(to bottom, ${C.gold}, transparent)`, opacity: visible ? 0.3 : 0, transition: `opacity 1.1s 0.9s ${EASE}` }} />
        <div style={{ marginTop: 28, fontFamily: CORMORANT, fontSize: isMobile ? 16 : 20, fontStyle: 'italic', color: C.brass, letterSpacing: '0.06em', transition: `opacity 1.1s 1.1s ${EASE}`, opacity: visible ? 1 : 0 }}>
          Where empire meets the sea.
        </div>
      </div>
    </section>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// COAST
// ═════════════════════════════════════════════════════════════════════════════
function CoastSection() {
  const { ref, visible } = useReveal(0.12)
  const w = useWindowWidth()
  const isMobile = w < 768

  return (
    <section style={{ position: 'relative', height: isMobile ? '100svh' : '100vh', overflow: 'hidden', backgroundColor: C.imperialBlack }}>
      <div ref={ref as React.RefObject<HTMLDivElement>} style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${IMG.coast})`, backgroundSize: 'cover', backgroundPosition: 'center 40%',
        filter: 'brightness(0.42) saturate(0.65)',
        transition: `transform 1.8s ${EASE}`, transform: visible ? 'scale(1.04)' : 'scale(1.14)',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(125deg, rgba(10,8,7,0.75) 0%, rgba(10,8,7,0.15) 55%, rgba(10,8,7,0.65) 100%)' }} />
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: isMobile ? 'flex-start' : 'space-between',
        padding: isMobile ? '0 28px 60px' : '0 80px',
        flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 28 : 40,
      }}>
        <div style={{ transition: `opacity 1.2s 0.3s ${EASE}, transform 1.2s 0.3s ${EASE}`, opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-44px)' }}>
          <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${C.gold}, transparent)`, marginBottom: 16, opacity: 0.45 }} />
          <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.4em', color: C.brass, marginBottom: 8 }}>THE LOCATION</div>
          <div style={{ fontFamily: CINZEL, fontSize: isMobile ? 20 : 'clamp(18px, 2.5vw, 28px)', letterSpacing: '0.14em', color: C.ivory, marginBottom: 6 }}>SHAMUK BEACH</div>
          <div style={{ fontFamily: CINZEL, fontSize: isMobile ? 14 : 'clamp(14px, 1.8vw, 18px)', letterSpacing: '0.14em', color: C.sand, marginBottom: 4 }}>COX'S BAZAR</div>
          <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.3em', color: C.brass }}>BANGLADESH</div>
          {!isMobile && (
            <div style={{ marginTop: 20, fontFamily: JOST, fontSize: 10, letterSpacing: '0.18em', color: C.brass, lineHeight: 1.9 }}>
              4 ACRES · PRIVATE LAND<br />BAY OF BENGAL
            </div>
          )}
        </div>
        <div style={{
          maxWidth: isMobile ? '100%' : 420,
          textAlign: isMobile ? 'left' : 'right',
          transition: `opacity 1.2s 0.5s ${EASE}, transform 1.2s 0.5s ${EASE}`,
          opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(44px)',
        }}>
          <div style={{ fontFamily: PLAYFAIR, fontStyle: 'italic', fontSize: isMobile ? 'clamp(20px, 5.5vw, 28px)' : 'clamp(24px, 3vw, 44px)', color: C.ivory, lineHeight: 1.4, marginBottom: 16 }}>
            Where the hills<br />meet the sea.
          </div>
          {!isMobile && (
            <div style={{ fontFamily: JOST, fontSize: 12, letterSpacing: '0.12em', color: C.sand, lineHeight: 1.9 }}>
              Along the Cox's Bazar–Teknaf Marine Drive,<br />hills to the east, Bengal to the west.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// STORY
// ═════════════════════════════════════════════════════════════════════════════
function StorySection() {
  const { ref, visible } = useReveal()
  const w = useWindowWidth()
  const isMobile = w < 768

  return (
    <section id="about" style={{
      backgroundColor: C.palaceBlack,
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '60fr 40fr',
      minHeight: isMobile ? 'auto' : '100vh',
    }}>
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: isMobile ? 280 : 600 }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${IMG.story})`, backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.65) saturate(0.7)',
          transition: `transform 1.8s ${EASE}`, transform: visible ? 'scale(1.03)' : 'scale(1.1)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: isMobile ? 'linear-gradient(to bottom, transparent 50%, #11100E 100%)' : 'linear-gradient(to right, transparent 55%, #11100E 100%)' }} />
        {!isMobile && <><Corner pos="tl" /><Corner pos="br" /></>}
      </div>
      <div ref={ref as React.RefObject<HTMLDivElement>} style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: isMobile ? '48px 28px 64px' : 'clamp(60px, 8vh, 120px) clamp(40px, 5vw, 80px)',
      }}>
        <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.45em', color: C.gold, marginBottom: 20, transition: `opacity 1s ${EASE}`, opacity: visible ? 1 : 0 }}>OUR STORY</div>
        <div style={{
          fontFamily: PLAYFAIR, fontSize: isMobile ? 'clamp(24px, 6vw, 36px)' : 'clamp(26px, 3.2vw, 46px)',
          color: C.ivory, lineHeight: 1.22, marginBottom: 24,
          transition: `opacity 1s 0.18s ${EASE}, transform 1s 0.18s ${EASE}`,
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)',
        }}>
          Bangladesh's First<br />Ottoman-Inspired<br />Five-Star Palace
        </div>
        <GoldLine w={48} />
        <div style={{ height: 24 }} />
        <div style={{ fontFamily: JOST, fontSize: 14, color: C.sand, lineHeight: 1.92, marginBottom: 36, transition: `opacity 1s 0.38s ${EASE}`, opacity: visible ? 1 : 0 }}>
          A dream born from heritage. An ambition to place Bangladesh on the international tourism map. Inspired by Hürrem Sultan — the woman who shaped an empire.
        </div>
        <a href="#about" style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          fontFamily: JOST, fontSize: 10, letterSpacing: '0.28em', color: C.champagne,
          textDecoration: 'none', width: 'fit-content', paddingBottom: 6,
          borderBottom: '1px solid rgba(179,138,62,0.3)',
          transition: `opacity 1s 0.52s ${EASE}`, opacity: visible ? 1 : 0,
        }}>DISCOVER OUR STORY →</a>
      </div>
    </section>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// ARCHITECTURE — SCROLL-HIJACKED
// Each venue locks the viewport for 100svh of scroll.
// ═════════════════════════════════════════════════════════════════════════════
const VENUES = [
  { num: '01', name: 'IMPERIAL\nARRIVAL HALL',        img: IMG.a1, desc: 'A soaring double-height entrance dressed in hand-carved Makrana marble, gilded muqarnas ceilings and Ottoman tessellation.' },
  { num: '02', name: 'HÜRREM\nROYAL HAMMAM',          img: IMG.a2, desc: 'Authentic Turkish bath culture reimagined — warm marble slabs, star-domed skylights and imported Kütahya tilework.' },
  { num: '03', name: 'TOPKAPI\nROYAL DINING',         img: IMG.a3, desc: 'Ottoman imperial gastronomy elevated for the contemporary palate. Twelve curated courses, five centuries of culinary tradition.' },
  { num: '04', name: 'GLASS BRIDGE\nOF THE BOSPHORUS',img: IMG.a4, desc: 'A 40-metre suspended crystal walkway above the ornamental gardens, connecting the palace wings with light and sky.' },
  { num: '05', name: 'INFINITY POOL\nOF THE SULTANA', img: IMG.a5, desc: 'An endless horizon pool where the Bay of Bengal becomes your skyline. Heated. Artesian water. Gold-tiled basin.' },
  { num: '06', name: 'JAHAN\nMOSQUE',                 img: IMG.a6, desc: 'A private mosque of extraordinary beauty. Hand-painted Iznik tilework, a 22-metre dome, capacity for 800 worshippers.' },
]

function ArchitectureSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const w = useWindowWidth()
  const isMobile = w < 768

  useEffect(() => {
    const fn = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const sectionH = el.getBoundingClientRect().height || el.offsetHeight
      const scrollable = sectionH - window.innerHeight
      if (scrollable < 1) return
      const scrolled = Math.max(0, -rect.top)
      const progress = Math.min(0.9999, scrolled / scrollable)
      setActive(Math.min(VENUES.length - 1, Math.floor(progress * VENUES.length)))
    }
    window.addEventListener('scroll', fn, { passive: true })
    const raf = requestAnimationFrame(fn)
    return () => { window.removeEventListener('scroll', fn); cancelAnimationFrame(raf) }
  }, [])

  return (
    <section id="architecture" ref={sectionRef} style={{ height: `${VENUES.length * 100}svh` }}>
      <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden', backgroundColor: C.imperialBlack }}>

        {/* Background images — crossfade */}
        {VENUES.map((v, i) => (
          <div key={v.num} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${v.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
            filter: 'brightness(0.42) saturate(0.68)',
            transition: `opacity 1.0s ${EASE}, transform 1.4s ${EASE}`,
            opacity: active === i ? 1 : 0,
            transform: active === i ? 'scale(1.04)' : 'scale(1.09)',
          }} />
        ))}

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,8,7,0.9) 0%, rgba(10,8,7,0.18) 55%, rgba(10,8,7,0.55) 100%)', pointerEvents: 'none' }} />
        {isMobile && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,8,7,0.4) 0%, rgba(10,8,7,0.8) 60%, rgba(10,8,7,0.98) 100%)', pointerEvents: 'none' }} />}

        {/* Progress bar — top gold line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: 'rgba(179,138,62,0.12)', zIndex: 2 }}>
          <div style={{ height: '100%', width: `${((active + 1) / VENUES.length) * 100}%`, backgroundColor: C.gold, transition: `width 0.6s ${EASE}`, opacity: 0.7 }} />
        </div>

        {/* Section label — top */}
        <div style={{ position: 'absolute', top: isMobile ? 56 : 72, left: isMobile ? 24 : 80, zIndex: 2 }}>
          <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.45em', color: C.gold }}>SIGNATURE ARCHITECTURE</div>
          <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.2em', color: C.brass, marginTop: 4 }}>
            {String(active + 1).padStart(2, '0')} — {String(VENUES.length).padStart(2, '0')}
          </div>
        </div>

        {/* Main content — venue info */}
        {isMobile ? (
          // Mobile: bottom stack layout
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 24px 80px', zIndex: 2 }}>
            <div key={active} style={{ animation: `slideLeft 0.7s ${EASE} both` }}>
              <div style={{ fontFamily: CINZEL, fontSize: 48, color: C.gold, opacity: 0.12, lineHeight: 1, marginBottom: -10 }}>{VENUES[active].num}</div>
              <div style={{ fontFamily: PLAYFAIR, fontSize: 'clamp(24px, 7vw, 36px)', color: C.ivory, lineHeight: 1.2, marginBottom: 12, whiteSpace: 'pre-line' }}>{VENUES[active].name}</div>
              <GoldLine w={32} />
              <div style={{ height: 12 }} />
              <div style={{ fontFamily: JOST, fontSize: 12, color: C.sand, lineHeight: 1.8 }}>{VENUES[active].desc}</div>
            </div>
            {/* Mobile dots */}
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              {VENUES.map((_, i) => (
                <div key={i} style={{ width: i === active ? 24 : 6, height: 2, backgroundColor: i === active ? C.champagne : C.brass, transition: `width 0.4s ease`, borderRadius: 1 }} />
              ))}
            </div>
          </div>
        ) : (
          // Desktop: left panel + right selector
          <>
            <div style={{ position: 'absolute', left: 80, top: '50%', transform: 'translateY(-50%)', maxWidth: 460, zIndex: 2 }}>
              <div key={active} style={{ animation: `slideLeft 0.7s ${EASE} both` }}>
                <div style={{ fontFamily: CINZEL, fontSize: 72, color: C.gold, opacity: 0.12, lineHeight: 1, marginBottom: -16, userSelect: 'none' }}>{VENUES[active].num}</div>
                <div style={{ fontFamily: PLAYFAIR, fontSize: 'clamp(28px, 3.5vw, 48px)', color: C.ivory, lineHeight: 1.18, marginBottom: 20, whiteSpace: 'pre-line' }}>{VENUES[active].name}</div>
                <GoldLine w={36} />
                <div style={{ height: 18 }} />
                <div style={{ fontFamily: JOST, fontSize: 13, color: C.sand, lineHeight: 1.88, maxWidth: 360 }}>{VENUES[active].desc}</div>
              </div>
            </div>

            {/* Right selector */}
            <div style={{ position: 'absolute', right: 80, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 20, zIndex: 2 }}>
              {VENUES.map((v, i) => (
                <div key={v.num} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ height: 1, width: active === i ? 28 : 10, backgroundColor: active === i ? C.champagne : C.brass, transition: 'width 0.4s ease, background-color 0.4s ease', display: 'block' }} />
                  <span style={{ fontFamily: JOST, fontSize: 10, letterSpacing: '0.2em', color: active === i ? C.champagne : C.brass, transition: 'color 0.4s ease' }}>{v.num}</span>
                </div>
              ))}
            </div>

            {/* Scroll hint */}
            <div style={{ position: 'absolute', bottom: 44, left: '50%', transform: 'translateX(-50%)', fontFamily: JOST, fontSize: 9, letterSpacing: '0.3em', color: C.brass, animation: 'progressPulse 2.5s infinite', whiteSpace: 'nowrap' }}>
              SCROLL TO EXPLORE
            </div>
          </>
        )}
      </div>
    </section>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// FACILITY CAROUSEL — SCROLL-HIJACKED, slides left-to-right
// ═════════════════════════════════════════════════════════════════════════════
const FACILITY_ITEMS = [
  { cat: 'DINING',       num: '01', img: IMG.fDining,       tagline: 'Ottoman feast. Contemporary mastery.',      items: ["Topkapi Royal Dining", "Harem Garden Restaurant", "Bosphorus Terrace Café", "Sultana's Tea Lounge", "Palace Bar"] },
  { cat: 'BANQUET',      num: '02', img: IMG.fBanquet,      tagline: 'Imperial venues for every grand occasion.', items: ["Imperial Grand Ballroom", "Suleiman Conference Hall", "Ottoman Garden Pavilion", "Roxelana Private Dining"] },
  { cat: 'POOLS',        num: '03', img: IMG.fPools,        tagline: 'Infinity, artisan water, Bengal horizon.',  items: ["Infinity Pool of the Sultana", "Children's Ottoman Pool", "Heated Indoor Pool", "Hydrotherapy Pool"] },
  { cat: 'WELLNESS',     num: '04', img: IMG.fWellness,     tagline: 'Ancient ritual. Modern restoration.',       items: ["Hürrem Royal Hammam", "Ayurvedic Spa", "Fitness Palace", "Meditation Terrace"] },
  { cat: 'FAMILY',       num: '05', img: IMG.fFamily,       tagline: 'Discovery for the next generation.',        items: ["Kids' Discovery Centre", "Family Beach Club", "Junior Ottoman Academy"] },
  { cat: 'LIBRARY',      num: '06', img: IMG.fLibrary,      tagline: 'Centuries of knowledge. One chamber.',      items: ["Imperial Reading Room", "Ottoman Heritage Archive"] },
  { cat: 'SHOPPING',     num: '07', img: IMG.fShopping,     tagline: 'Rare artisanship. Curated collections.',    items: ["Palace Artisan Boutique", "Turkish Bazaar", "Jewellery Atelier"] },
  { cat: 'FAITH',        num: '08', img: IMG.fFaith,        tagline: 'A private sanctuary of extraordinary beauty.', items: ["Jahan Mosque", "Prayer Rooms", "Wudu Facilities"] },
  { cat: 'BEACH',        num: '09', img: IMG.fBeach,        tagline: 'The Bay of Bengal, privately yours.',       items: ["Private Beach Club", "Water Sports Centre", "Sunset Pier"] },
  { cat: 'PRESIDENTIAL', num: '10', img: IMG.fPresidential, tagline: 'The pinnacle of palace living.',             items: ["Presidential Suite", "Royal Medical Centre", "Private Helipad"] },
]

function FacilityCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const w = useWindowWidth()
  const isMobile = w < 768

  useEffect(() => {
    const fn = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const sectionH = el.getBoundingClientRect().height || el.offsetHeight
      const scrollable = sectionH - window.innerHeight
      if (scrollable < 1) return
      const scrolled = Math.max(0, -rect.top)
      const progress = Math.min(0.9999, scrolled / scrollable)
      setActive(Math.min(FACILITY_ITEMS.length - 1, Math.floor(progress * FACILITY_ITEMS.length)))
    }
    window.addEventListener('scroll', fn, { passive: true })
    const raf = requestAnimationFrame(fn)
    return () => { window.removeEventListener('scroll', fn); cancelAnimationFrame(raf) }
  }, [])

  const item = FACILITY_ITEMS[active]

  return (
    <section ref={sectionRef} style={{ height: `${FACILITY_ITEMS.length * 70}svh` }}>
      <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden', backgroundColor: C.imperialBlack }}>

        {/* Background images — slide-in from right */}
        {FACILITY_ITEMS.map((fi, i) => (
          <div key={fi.cat} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${fi.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
            filter: 'brightness(0.38) saturate(0.6)',
            transition: `opacity 0.9s ${EASE}, transform 1.2s ${EASE}`,
            opacity: active === i ? 1 : 0,
            transform: active === i ? 'scale(1.04) translateX(0%)' : 'scale(1.06) translateX(2%)',
          }} />
        ))}

        {/* Gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,8,7,0.88) 0%, rgba(10,8,7,0.35) 50%, rgba(10,8,7,0.65) 100%)', pointerEvents: 'none' }} />
        {isMobile && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,8,7,0.5) 0%, rgba(10,8,7,0.88) 55%, rgba(10,8,7,0.99) 100%)', pointerEvents: 'none' }} />}

        {/* Top progress bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: 'rgba(179,138,62,0.12)', zIndex: 2 }}>
          <div style={{ height: '100%', width: `${((active + 1) / FACILITY_ITEMS.length) * 100}%`, backgroundColor: C.gold, transition: `width 0.6s ${EASE}`, opacity: 0.7 }} />
        </div>

        {/* Section label */}
        <div style={{ position: 'absolute', top: isMobile ? 56 : 72, left: isMobile ? 24 : 80, zIndex: 2 }}>
          <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.45em', color: C.gold }}>PALACE FACILITIES</div>
          <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.2em', color: C.brass, marginTop: 4 }}>
            {String(active + 1).padStart(2, '0')} — {String(FACILITY_ITEMS.length).padStart(2, '0')}
          </div>
        </div>

        {isMobile ? (
          // Mobile layout — bottom stack
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 24px 80px', zIndex: 2 }}>
            <div key={active} style={{ animation: `slideRight 0.7s ${EASE} both` }}>
              <div style={{ fontFamily: CINZEL, fontSize: 48, color: C.gold, opacity: 0.12, lineHeight: 1, marginBottom: -10 }}>{item.num}</div>
              <div style={{ fontFamily: CINZEL, fontSize: 'clamp(22px, 7vw, 32px)', letterSpacing: '0.12em', color: C.ivory, marginBottom: 10 }}>{item.cat}</div>
              <div style={{ fontFamily: CORMORANT, fontSize: 15, fontStyle: 'italic', color: C.sand, marginBottom: 20 }}>{item.tagline}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {item.items.map(f => (
                  <span key={f} style={{ fontFamily: JOST, fontSize: 10, letterSpacing: '0.1em', color: C.brass, padding: '5px 12px', border: '1px solid rgba(114,92,49,0.3)', borderRadius: 0 }}>{f}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
              {FACILITY_ITEMS.map((_, i) => (
                <div key={i} style={{ width: i === active ? 20 : 5, height: 2, backgroundColor: i === active ? C.champagne : C.brass, transition: 'width 0.4s ease', borderRadius: 1 }} />
              ))}
            </div>
          </div>
        ) : (
          // Desktop layout
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 80px', zIndex: 2 }}>
            {/* Left — category name + tagline */}
            <div style={{ maxWidth: 500 }}>
              <div key={`label-${active}`} style={{ animation: `slideRight 0.7s ${EASE} both` }}>
                <div style={{ fontFamily: CINZEL, fontSize: 80, color: C.gold, opacity: 0.1, lineHeight: 1, marginBottom: -20, userSelect: 'none' }}>{item.num}</div>
                <div style={{ fontFamily: CINZEL, fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '0.1em', color: C.ivory, lineHeight: 1.1, marginBottom: 16 }}>{item.cat}</div>
                <div style={{ fontFamily: CORMORANT, fontSize: 20, fontStyle: 'italic', color: C.sand, marginBottom: 28, letterSpacing: '0.05em' }}>{item.tagline}</div>
                <GoldLine w={40} />
              </div>
            </div>

            {/* Right — facility list */}
            <div style={{ maxWidth: 380 }}>
              <div key={`list-${active}`} style={{ animation: `slideRight 0.85s 0.1s ${EASE} both`, opacity: 0 }}>
                {item.items.map((f, fi) => (
                  <div key={f} style={{
                    fontFamily: JOST, fontSize: 13, letterSpacing: '0.1em', color: C.sand,
                    padding: '14px 0', lineHeight: 1,
                    borderBottom: fi < item.items.length - 1 ? '1px solid rgba(114,92,49,0.18)' : 'none',
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}>
                    <span style={{ width: 4, height: 4, backgroundColor: C.gold, opacity: 0.5, flexShrink: 0, borderRadius: '50%' }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Category tabs at bottom — desktop */}
        {!isMobile && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', zIndex: 2, borderTop: '1px solid rgba(114,92,49,0.15)' }}>
            {FACILITY_ITEMS.map((fi, i) => (
              <div key={fi.cat} style={{
                flex: 1, padding: '14px 0', textAlign: 'center',
                fontFamily: JOST, fontSize: 9, letterSpacing: '0.2em',
                color: active === i ? C.champagne : C.brass,
                backgroundColor: active === i ? 'rgba(179,138,62,0.08)' : 'transparent',
                borderBottom: active === i ? `2px solid ${C.gold}` : '2px solid transparent',
                transition: 'color 0.4s ease, background-color 0.4s ease, border-color 0.4s ease',
                cursor: 'default',
              }}>{fi.cat}</div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// INVESTMENT
// ═════════════════════════════════════════════════════════════════════════════
const BENEFITS = [
  { num: '01', title: 'LAND-BACKED',            desc: 'Secured against company-owned land at Shamuk Beach, Cox\'s Bazar. Physical land, not financial speculation.' },
  { num: '02', title: 'LONG-TERM',              desc: 'A 2027–2032 development timeline with defined milestones and board oversight. Built for generational value.' },
  { num: '03', title: 'TRANSFERABLE',           desc: 'Shares may be transferred, gifted or bequeathed to heirs. A legacy asset that grows across generations.' },
  { num: '04', title: 'OPERATIONAL OPPORTUNITY',desc: 'Qualifying shareholders may access revenue-sharing arrangements during the operational phase from 2032.' },
  { num: '05', title: 'PRIVILEGES',             desc: 'Priority palace booking, exclusive shareholder rates, invitations to annual shareholder events.' },
  { num: '06', title: 'INHERITANCE',            desc: 'Fully halal and Sharia-compliant. Structured for clean transfer within your estate under Islamic inheritance principles.' },
]

const PACKAGES = [
  { label: 'SINGLE',  shares: '1 SHARE',    note: 'Per share base price',  full: '৳5,00,000',    m12: '৳45,000 / mo',  m24: '৳24,000 / mo' },
  { label: 'PREMIUM', shares: '5–9 SHARES', note: '৳5,00,000 / share',    full: '৳25,00,000+',  m12: '৳2,10,000 / mo',m24: '৳1,15,000 / mo', featured: true },
  { label: 'PRIVATE', shares: '10+ SHARES', note: 'Enquire privately',     full: 'Private terms', m12: 'Custom',        m24: 'Custom' },
]

type Plan = 'full' | 'm12' | 'm24'

function InvestmentSection() {
  const [activeBenefit, setActiveBenefit] = useState(0)
  const [plan, setPlan] = useState<Plan>('full')
  const { ref, visible } = useReveal(0.1)
  const w = useWindowWidth()
  const isMobile = w < 768

  return (
    <section id="investment" style={{ backgroundColor: C.palaceBlack, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${IMG.dome})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.1) saturate(0.3)' }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1320, margin: '0 auto', padding: isMobile ? '80px 24px' : '120px 80px' }}>

        {/* Header */}
        <div ref={ref as React.RefObject<HTMLDivElement>} style={{ marginBottom: isMobile ? 48 : 80 }}>
          <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.45em', color: C.gold, marginBottom: 20, transition: `opacity 1s ${EASE}`, opacity: visible ? 1 : 0 }}>INVESTMENT</div>
          <div style={{ fontFamily: PLAYFAIR, fontSize: isMobile ? 'clamp(32px, 8vw, 52px)' : 'clamp(36px, 5.5vw, 76px)', color: C.ivory, lineHeight: 1.1, transition: `opacity 1s 0.2s ${EASE}, transform 1s 0.2s ${EASE}`, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(34px)' }}>
            OWN THE LAND.<br />OWN THE LEGACY.
          </div>
          <div style={{ marginTop: 20, fontFamily: CORMORANT, fontSize: isMobile ? 15 : 18, fontStyle: 'italic', color: C.brass, transition: `opacity 1s 0.4s ${EASE}`, opacity: visible ? 1 : 0 }}>
            Halal · Sharia-compliant · Land-backed
          </div>
        </div>

        {/* Benefits */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', border: '1px solid rgba(114,92,49,0.22)', marginBottom: isMobile ? 48 : 80 }}>
          <div style={{ borderRight: isMobile ? 'none' : '1px solid rgba(114,92,49,0.22)', borderBottom: isMobile ? '1px solid rgba(114,92,49,0.22)' : 'none' }}>
            {BENEFITS.map((b, i) => (
              <button key={b.num} onClick={() => setActiveBenefit(i)} style={{
                width: '100%', padding: isMobile ? '16px 20px' : '22px 28px',
                display: 'flex', alignItems: 'center', gap: 16,
                background: activeBenefit === i ? 'rgba(94,15,26,0.22)' : 'transparent',
                border: 'none', borderBottom: i < BENEFITS.length - 1 ? '1px solid rgba(114,92,49,0.14)' : 'none',
                cursor: 'pointer', textAlign: 'left', transition: 'background 0.35s ease',
              }}>
                <span style={{ fontFamily: CINZEL, fontSize: isMobile ? 20 : 26, minWidth: 42, color: activeBenefit === i ? C.champagne : C.brass, opacity: activeBenefit === i ? 1 : 0.5, transition: 'color 0.3s, opacity 0.3s' }}>{b.num}</span>
                <span style={{ fontFamily: JOST, fontSize: isMobile ? 10 : 10, letterSpacing: '0.18em', color: activeBenefit === i ? C.champagne : C.sand, transition: 'color 0.3s' }}>{b.title}</span>
                {activeBenefit === i && <span style={{ marginLeft: 'auto', width: 3, height: 3, borderRadius: '50%', backgroundColor: C.gold }} />}
              </button>
            ))}
          </div>
          <div style={{ padding: isMobile ? '28px 20px' : '48px 44px', display: 'flex', alignItems: 'center' }}>
            <div key={activeBenefit} style={{ animation: `fadeIn 0.5s ${EASE}` }}>
              <div style={{ fontFamily: CINZEL, fontSize: isMobile ? 40 : 64, color: C.gold, opacity: 0.1, lineHeight: 1, marginBottom: -10 }}>{BENEFITS[activeBenefit].num}</div>
              <div style={{ fontFamily: PLAYFAIR, fontSize: isMobile ? 22 : 28, color: C.ivory, marginBottom: 14, lineHeight: 1.25 }}>{BENEFITS[activeBenefit].title}</div>
              <GoldLine w={28} />
              <div style={{ height: 14 }} />
              <div style={{ fontFamily: JOST, fontSize: 13, color: C.sand, lineHeight: 1.9 }}>{BENEFITS[activeBenefit].desc}</div>
            </div>
          </div>
        </div>

        {/* Packages */}
        <div style={{ marginBottom: isMobile ? 48 : 70 }}>
          <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.45em', color: C.gold, marginBottom: 28 }}>SHARE PACKAGES</div>
          <div style={{ display: 'flex', width: 'fit-content', marginBottom: 36, border: '1px solid rgba(114,92,49,0.3)' }}>
            {(['full', 'm12', 'm24'] as Plan[]).map((p, i) => (
              <button key={p} onClick={() => setPlan(p)} style={{
                padding: isMobile ? '10px 14px' : '10px 26px',
                fontFamily: JOST, fontSize: isMobile ? 9 : 10, letterSpacing: '0.18em',
                backgroundColor: plan === p ? C.gold : 'transparent', color: plan === p ? C.imperialBlack : C.sand,
                border: 'none', borderLeft: i > 0 ? '1px solid rgba(114,92,49,0.3)' : 'none',
                cursor: 'pointer', transition: 'all 0.35s ease', fontWeight: plan === p ? 600 : 400,
              }}>
                {p === 'full' ? 'FULL' : p === 'm12' ? '12 MONTHS' : '24 MONTHS'}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 1, backgroundColor: 'rgba(114,92,49,0.18)' }}>
            {PACKAGES.map(pkg => (
              <div key={pkg.label} style={{ backgroundColor: pkg.featured ? 'rgba(94,15,26,0.28)' : C.palaceBlack, padding: isMobile ? '36px 24px' : '48px 36px', position: 'relative', borderTop: pkg.featured ? `2px solid ${C.gold}` : '2px solid transparent' }}>
                {pkg.featured && <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', fontFamily: JOST, fontSize: 8, letterSpacing: '0.3em', color: C.imperialBlack, backgroundColor: C.gold, padding: '4px 14px' }}>RECOMMENDED</div>}
                <div style={{ fontFamily: CINZEL, fontSize: 12, letterSpacing: '0.3em', color: C.champagne, marginBottom: 6 }}>{pkg.label}</div>
                <div style={{ fontFamily: JOST, fontSize: 10, letterSpacing: '0.18em', color: C.brass, marginBottom: 28 }}>{pkg.shares}</div>
                <div style={{ fontFamily: PLAYFAIR, fontSize: 'clamp(20px, 2.5vw, 30px)', color: C.ivory, marginBottom: 6 }}>{plan === 'full' ? pkg.full : plan === 'm12' ? pkg.m12 : pkg.m24}</div>
                <div style={{ fontFamily: JOST, fontSize: 10, letterSpacing: '0.1em', color: C.brass, marginBottom: 28 }}>{pkg.note}</div>
                <button style={{ width: '100%', padding: '13px', border: `1px solid ${pkg.featured ? C.gold : 'rgba(114,92,49,0.4)'}`, backgroundColor: 'transparent', fontFamily: JOST, fontSize: 10, letterSpacing: '0.22em', color: pkg.featured ? C.champagne : C.sand, cursor: 'pointer', transition: 'all 0.35s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(179,138,62,0.12)'; e.currentTarget.style.color = C.champagne }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = pkg.featured ? C.champagne : C.sand }}
                >REQUEST INFORMATION</button>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div style={{ borderTop: '1px solid rgba(114,92,49,0.2)', paddingTop: isMobile ? 40 : 60 }}>
          <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.45em', color: C.gold, marginBottom: 36 }}>THE PROCESS</div>
          <div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: isMobile ? 'wrap' : 'nowrap', gap: isMobile ? '24px 0' : 0 }}>
            {[
              { num: '01', title: 'CHOOSE',      desc: 'Select your package' },
              { num: '02', title: 'BOOK',         desc: 'Reserve & deposit' },
              { num: '03', title: 'CERTIFICATE',  desc: 'Receive certificate' },
              { num: '04', title: 'SUB-KABALA',   desc: 'Register land interest' },
            ].map((step, i, arr) => (
              <div key={step.num} style={{ flex: isMobile ? '0 0 50%' : 1, position: 'relative', paddingRight: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${C.gold}`, backgroundColor: C.imperialBlack, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: CINZEL, fontSize: 10, color: C.gold }}>{step.num}</span>
                  </div>
                  {i < arr.length - 1 && !isMobile && <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(179,138,62,0.4), rgba(179,138,62,0.12))' }} />}
                </div>
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontFamily: CINZEL, fontSize: 10, letterSpacing: '0.2em', color: C.champagne, marginBottom: 5 }}>{step.title}</div>
                  <div style={{ fontFamily: JOST, fontSize: 11, color: C.brass, lineHeight: 1.6 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// CONTACT
// ═════════════════════════════════════════════════════════════════════════════
function ContactSection() {
  const { ref, visible } = useReveal()
  const [form, setForm] = useState({ name: '', phone: '', email: '', interest: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const w = useWindowWidth()
  const isMobile = w < 768

  const fieldStyle: React.CSSProperties = {
    width: '100%', background: 'none', border: 'none',
    borderBottom: '1px solid rgba(114,92,49,0.38)', padding: '12px 0',
    fontFamily: JOST, fontSize: 15, color: C.ivory, outline: 'none', letterSpacing: '0.04em',
    transition: 'border-color 0.3s ease',
  }
  const labelStyle: React.CSSProperties = { display: 'block', fontFamily: JOST, fontSize: 9, letterSpacing: '0.35em', color: C.gold, marginBottom: 10 }

  return (
    <section id="contact" style={{ backgroundColor: C.imperialBlack, minHeight: '100vh' }}>
      <div style={{
        maxWidth: 1320, margin: '0 auto', padding: isMobile ? '80px 24px' : '120px 80px',
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.15fr', gap: isMobile ? 48 : 80,
      }}>
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.45em', color: C.gold, marginBottom: 28, transition: `opacity 1s ${EASE}`, opacity: visible ? 1 : 0 }}>GET IN TOUCH</div>
          <div style={{ fontFamily: PLAYFAIR, fontSize: isMobile ? 'clamp(32px, 8vw, 52px)' : 'clamp(36px, 4vw, 58px)', color: C.ivory, lineHeight: 1.18, marginBottom: 32, transition: `opacity 1s 0.18s ${EASE}, transform 1s 0.18s ${EASE}`, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(22px)' }}>
            Let's Talk
          </div>
          <div style={{ fontFamily: CORMORANT, fontSize: isMobile ? 17 : 20, fontStyle: 'italic', color: C.sand, lineHeight: 2, marginBottom: 44, transition: `opacity 1s 0.32s ${EASE}`, opacity: visible ? 1 : 0 }}>
            About the palace.<br />About ownership.<br />About the future.
          </div>
          <div style={{ transition: `opacity 1s 0.5s ${EASE}`, opacity: visible ? 1 : 0 }}>
            <GoldLine w={40} />
            <div style={{ height: 28 }} />
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.35em', color: C.gold, marginBottom: 8 }}>DHAKA OFFICE</div>
              <div style={{ fontFamily: JOST, fontSize: 13, color: C.sand, lineHeight: 1.9 }}>Hurrem Palace Limited<br />Dhaka, Bangladesh</div>
            </div>
            <div>
              <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.35em', color: C.gold, marginBottom: 8 }}>PROJECT SITE</div>
              <div style={{ fontFamily: JOST, fontSize: 13, color: C.sand, lineHeight: 1.9 }}>Shamuk Beach · Cox's Bazar–Teknaf Marine Drive<br />Cox's Bazar, Bangladesh</div>
            </div>
            {!isMobile && <div style={{ marginTop: 44, opacity: 0.3 }}><ImperialSeal size={72} /></div>}
          </div>
        </div>

        <div style={{ paddingTop: isMobile ? 0 : 72 }}>
          {!submitted ? (
            <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }}>
              {[{ k: 'name', l: 'NAME', t: 'text' }, { k: 'phone', l: 'PHONE', t: 'tel' }, { k: 'email', l: 'EMAIL', t: 'email' }].map(({ k, l, t }) => (
                <div key={k} style={{ marginBottom: 28 }}>
                  <label style={labelStyle}>{l}</label>
                  <input type={t} value={form[k as keyof typeof form]} onChange={e => setForm({ ...form, [k]: e.target.value })} style={fieldStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = C.gold)} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(114,92,49,0.38)')} />
                </div>
              ))}
              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>INTEREST</label>
                <select value={form.interest} onChange={e => setForm({ ...form, interest: e.target.value })} style={{ ...fieldStyle, cursor: 'pointer', appearance: 'none', color: form.interest ? C.ivory : C.brass }}
                  onFocus={e => (e.currentTarget.style.borderColor = C.gold)} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(114,92,49,0.38)')}>
                  <option value="" style={{ backgroundColor: C.palaceBlack }}>Select your interest</option>
                  {['Investment Enquiry', 'Partnership', 'Media & Press', 'General Enquiry'].map(o => <option key={o} value={o.toLowerCase()} style={{ backgroundColor: C.palaceBlack }}>{o}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 40 }}>
                <label style={labelStyle}>MESSAGE</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} style={{ ...fieldStyle, resize: 'none' }}
                  onFocus={e => (e.currentTarget.style.borderColor = C.gold)} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(114,92,49,0.38)')} />
              </div>
              <button type="submit" style={{ width: '100%', padding: '17px', border: `1px solid ${C.gold}`, backgroundColor: 'transparent', fontFamily: JOST, fontSize: isMobile ? 10 : 11, letterSpacing: '0.26em', color: C.champagne, cursor: 'pointer', transition: `all 0.5s ${EASE}` }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(179,138,62,0.1)'; e.currentTarget.style.letterSpacing = '0.36em' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.letterSpacing = '0.26em' }}>
                REQUEST A PRIVATE CONSULTATION
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0', animation: `fadeIn 0.8s ${EASE}` }}>
              <ImperialSeal size={80} opacity={0.7} />
              <div style={{ fontFamily: PLAYFAIR, fontSize: 22, color: C.ivory, marginTop: 32, marginBottom: 14 }}>Your enquiry has been received.</div>
              <div style={{ fontFamily: CORMORANT, fontSize: 16, fontStyle: 'italic', color: C.sand }}>A member of the palace team will be in touch shortly.</div>
              <div style={{ margin: '28px auto 0', width: 60, height: 1, background: C.gold, opacity: 0.3 }} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// FOOTER
// ═════════════════════════════════════════════════════════════════════════════
function Footer() {
  const w = useWindowWidth()
  const isMobile = w < 768

  return (
    <footer style={{ backgroundColor: '#090706', borderTop: '1px solid rgba(114,92,49,0.18)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: isMobile ? '60px 24px 0' : '80px 80px 0' }}>
        <img src="/imports/HLogo_v.png" alt="Hurrem Palace Logo" style={{ height: isMobile ? 36 : 60, marginBottom: 12, filter: 'brightness(0) saturate(100%) invert(90%) sepia(6%) saturate(467%) hue-rotate(359deg) brightness(92%) contrast(91%)' }} />
        <div style={{ fontFamily: CORMORANT, fontSize: 13, fontStyle: 'italic', color: C.brass, marginBottom: 48, letterSpacing: '0.08em' }}>
          An Ottoman Legacy on Bangladesh's Coast
        </div>
        <div style={{ width: '100%', height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, opacity: 0.3, marginBottom: 48 }} />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '32px 20px' : 40, marginBottom: 56 }}>
          {[
            { head: 'NAVIGATE', links: [['HOME','#home'],['ABOUT','#about'],['ARCHITECTURE','#architecture'],['INVESTMENT','#investment'],['CONTACT','#contact']] },
            { head: 'ABOUT', links: [['OUR STORY','#about'],['PROJECT & LOCATION','#about'],['COMPANY DETAILS','#about']] },
            { head: 'LEGAL', links: [['PRIVACY POLICY',''],['TERMS OF USE',''],['INVESTMENT DISCLOSURE','']] },
            { head: 'CONTACT', links: [['Dhaka, Bangladesh',''],['Shamuk Beach',''],['Cox\'s Bazar, BD','']] },
          ].map(col => (
            <div key={col.head}>
              <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.4em', color: C.gold, marginBottom: 18 }}>{col.head}</div>
              {col.links.map(([label, href]) => (
                href ? (
                  <a key={label} href={href} style={{ display: 'block', fontFamily: JOST, fontSize: isMobile ? 11 : 12, letterSpacing: '0.1em', color: C.sand, textDecoration: 'none', marginBottom: 11, transition: 'color 0.3s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.champagne)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.sand)}
                  >{label}</a>
                ) : (
                  <span key={label} style={{ display: 'block', fontFamily: JOST, fontSize: isMobile ? 11 : 12, letterSpacing: '0.1em', color: C.brass, marginBottom: 11 }}>{label}</span>
                )
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(179,138,62,0.18)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: isMobile ? '18px 24px' : '22px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontFamily: JOST, fontSize: 9, letterSpacing: '0.18em', color: C.brass }}>© 2025 HURREM PALACE LIMITED. ALL RIGHTS RESERVED.</div>
          {!isMobile && <div style={{ fontFamily: CORMORANT, fontSize: 12, fontStyle: 'italic', color: C.brass }}>Hurrem Palace Limited — Private Limited Company</div>}
        </div>
      </div>
    </footer>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [loaded, setLoaded] = useState(false)
  const handleComplete = useCallback(() => setLoaded(true), [])
  return (
    <>
      <style>{KEYFRAMES}</style>
      {!loaded && <LoadingScreen onComplete={handleComplete} />}
      <div style={{ opacity: loaded ? 1 : 0, transition: `opacity 1s ${EASE}`, backgroundColor: C.imperialBlack }}>
        <Navigation />
        <HeroSection />
        <ManifestoSection />
        <CoastSection />
        <StorySection />
        <ArchitectureSection />
        <FacilityCarousel />
        <InvestmentSection />
        <ContactSection />
        <Footer />
      </div>
    </>
  )
}
