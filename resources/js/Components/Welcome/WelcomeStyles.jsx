// resources/js/Components/Welcome/WelcomeStyles.jsx

export default function WelcomeStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
      * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
      html { scroll-behavior: smooth; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50%       { transform: translateY(-14px) rotate(3deg); }
      }
      @keyframes pulse-slow {
        0%, 100% { opacity: 0.4; transform: scale(1); }
        50%       { opacity: 0.7; transform: scale(1.08); }
      }
      @keyframes shimmer {
        0%   { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes ticker {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      .fade-up    { animation: fadeUp 0.6s ease both; }
      .float      { animation: float 6s ease-in-out infinite; }
      .pulse-slow { animation: pulse-slow 5s ease-in-out infinite; }

      .gradient-text {
        background: linear-gradient(135deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .shimmer-text {
        background: linear-gradient(90deg, #0F172A 25%, #2563EB 50%, #0F172A 75%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: shimmer 4s linear infinite;
      }
      /* (tagline héro : styles dans HeroSection avec dark:) — laisser pour autres usages */
      .dark .shimmer-text {
        background: linear-gradient(90deg, #e2e8f0 10%, #38bdf8 40%, #a5b4fc 70%, #e2e8f0 90%) !important;
        background-size: 200% auto !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
        -webkit-background-clip: text !important;
      }
      .glass {
        background: rgba(255,255,255,0.85);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
      }
      .dark .glass {
        background: rgba(15, 23, 42, 0.7);
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.4);
      }
      .hero-grid {
        background-image:
          linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px);
        background-size: 48px 48px;
      }
      .dark .hero-grid {
        background-image:
          linear-gradient(rgba(56, 189, 248, 0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56, 189, 248, 0.07) 1px, transparent 1px);
      }
      .btn-primary {
        background: linear-gradient(135deg, #2563EB, #4F46E5);
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(37,99,235,0.35);
      }
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(37,99,235,0.45);
      }
      .ticker-wrap  { overflow: hidden; }
      .ticker-track {
        display: flex;
        width: max-content;
        animation: ticker 20s linear infinite;
      }
      .ticker-track:hover { animation-play-state: paused; }
    `}</style>
  );
}