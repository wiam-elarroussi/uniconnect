// resources/js/Components/Dashboard/dashStyles.js
export const DASH_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    /* Defaults: dark-but-not-black, more comfortable */
    --bg-deep:     #0b1433;
    --bg-ambient:  radial-gradient(circle at 12% 20%, rgba(99,179,237,0.20), transparent 45%),
                   radial-gradient(circle at 85% 10%, rgba(183,148,244,0.14), transparent 40%),
                   radial-gradient(circle at 50% 95%, rgba(118,228,176,0.10), transparent 40%),
                   linear-gradient(180deg, #0b1433 0%, #060818 100%);
    --bg-card:     rgba(10,12,28,0.85);
    --bg-glass:    rgba(255,255,255,0.04);
    --bg-glass2:   rgba(255,255,255,0.07);
    --border:      rgba(255,255,255,0.07);
    --border-glow: rgba(99,179,237,0.3);
    --panel-bg:   rgba(10,12,28,0.97);
    --comments-bg: rgba(0,0,0,0.2);
    --shadow-strong: rgba(0,0,0,0.4);
    --input-bg:       rgba(255,255,255,0.03);
    --input-border:   rgba(255,255,255,0.07);
    --input-placeholder: #4a5578;
    --text-1:      #f0f4ff;
    --text-2:      #8b9cc8;
    --text-3:      #4a5578;
    --accent-1:    #63b3ed;
    --accent-2:    #76e4b0;
    --accent-3:    #b794f4;
    --accent-hot:  #f6ad55;
    --glow-blue:   rgba(99,179,237,0.15);
    --glow-green:  rgba(118,228,176,0.12);
    --glow-purple: rgba(183,148,244,0.12);
  }

  .dash-root * { font-family: 'DM Sans', sans-serif; }
  .dash-root h1,.dash-root h2,.dash-root h3,.dash-root .font-display { font-family: 'Syne', sans-serif; }

  .dash-root ::-webkit-scrollbar { width: 3px; height: 3px; }
  .dash-root ::-webkit-scrollbar-track { background: transparent; }
  .dash-root ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  /* Motion: keep it tasteful, not aggressive */
  @keyframes d-fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes d-slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
  @keyframes d-pop     { 0%{transform:scale(1)} 40%{transform:scale(1.15)} 70%{transform:scale(0.97)} 100%{transform:scale(1)} }
  @keyframes d-pulse-ring { 0%{box-shadow:0 0 0 0 rgba(99,179,237,0.4)} 70%{box-shadow:0 0 0 8px transparent} 100%{box-shadow:0 0 0 0 transparent} }
  @keyframes d-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  @keyframes d-rotate  { to{transform:rotate(360deg)} }
  @keyframes d-glow-pulse { 0%,100%{opacity:.4} 50%{opacity:.9} }
  @keyframes d-scan    { 0%{top:-20%} 100%{top:120%} }
  @keyframes d-shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

  .d-fade-up  { animation: d-fadeUp  0.35s cubic-bezier(0.16,1,0.3,1) both; }
  .d-slide-in { animation: d-slideIn 0.32s cubic-bezier(0.16,1,0.3,1) both; }
  .d-pop      { animation: d-pop 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }
  .d-float    { animation: d-float 7s ease-in-out 1 both; }
  .d-glow     { opacity: .65; }

  .glass-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
  .glass-card:hover { border-color: var(--border-glow); }

  .btn-neon {
    background: linear-gradient(135deg, #1a6cad 0%, #2d3a8c 100%);
    box-shadow: 0 0 20px rgba(99,179,237,0.25), inset 0 1px 0 rgba(255,255,255,0.1);
    transition: all 0.3s ease;
  }
  .btn-neon:hover { box-shadow: 0 0 30px rgba(99,179,237,0.5), inset 0 1px 0 rgba(255,255,255,0.15); transform: translateY(-1px); }
  .btn-neon:disabled { opacity: 0.35; transform: none; box-shadow: none; }

  /* Rings: static by default (less “harcelant”) */
  .holo-ring { background: conic-gradient(from 0deg,#63b3ed,#76e4b0,#b794f4,#f6ad55,#fc8181,#63b3ed); }
  .story-ring { background: conic-gradient(from 0deg,#f6ad55,#fc8181,#b794f4,#76e4b0,#63b3ed,#f6ad55); }

  .scan-line { position: relative; overflow: hidden; }
  .scan-line::after {
    content:'';
    position:absolute;
    left:0; right:0;
    height:40px;
    background:linear-gradient(transparent,rgba(99,179,237,0.05),transparent);
    top:-20%;
    opacity:0;
    pointer-events:none;
  }
  .scan-line:hover::after {
    opacity:1;
    animation:d-scan 6s linear 1 both;
  }

  .noise::before { content:''; position:absolute; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E"); pointer-events:none; border-radius:inherit; z-index:1; }

  .pulse-ring { /* keep a calm static ring */ animation: d-pulse-ring 2.5s cubic-bezier(0.215,0.61,0.355,1) 1 both; }

  .grad-text { background: linear-gradient(135deg, #63b3ed, #76e4b0); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .glow-blue { text-shadow: 0 0 20px rgba(99,179,237,0.8); color: #63b3ed; }
  .glow-green { text-shadow: 0 0 20px rgba(118,228,176,0.8); color: #76e4b0; }

  .tag-question { background:rgba(246,173,85,0.1);  color:#f6ad55; border:1px solid rgba(246,173,85,0.2); }
  .tag-resource { background:rgba(99,179,237,0.1);  color:#63b3ed; border:1px solid rgba(99,179,237,0.2); }
  .tag-project  { background:rgba(183,148,244,0.1); color:#b794f4; border:1px solid rgba(183,148,244,0.2); }

  .input-neo { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); color:#f0f4ff; transition:all 0.25s; }
  .input-neo {
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    color: var(--text-1);
    transition: all 0.25s;
  }
  .input-neo:focus {
    outline:none;
    border-color: var(--accent-1);
    box-shadow:0 0 0 3px rgba(99,179,237,0.1),0 0 20px rgba(99,179,237,0.08);
    background:rgba(99,179,237,0.04);
  }
  .input-neo::placeholder { color: var(--input-placeholder); }

  .post-card { transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s; }
  .post-card:hover { border-color:rgba(99,179,237,0.2) !important; box-shadow:0 8px 40px var(--shadow-strong),0 0 0 1px rgba(99,179,237,0.1); transform:translateY(-2px); }

  .no-scroll::-webkit-scrollbar { display:none; }
  .no-scroll { -ms-overflow-style:none; scrollbar-width:none; }

  @media (prefers-reduced-motion: reduce) {
    .dash-root * {
      animation: none !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
    .scan-line:hover::after { opacity: 0 !important; }
  }
`;