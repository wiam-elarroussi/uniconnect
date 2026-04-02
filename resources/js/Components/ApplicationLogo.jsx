export default function ApplicationLogo({ showText = true, size = 'md', className = '', ...props }) {
    const sizes = {
        sm: { img: 'h-7 w-7', text: 'text-base', dot: 'w-1.5 h-1.5' },
        md: { img: 'h-9 w-9', text: 'text-lg',   dot: 'w-2 h-2'   },
        lg: { img: 'h-12 w-12', text: 'text-2xl', dot: 'w-2.5 h-2.5' },
    };
    const s = sizes[size] || sizes.md;

    return (
        <div className={`flex items-center gap-2.5 group ${className}`} {...props}>
            {/* Logo image avec glow subtil au hover */}
            <div className="relative flex-shrink-0">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-25 blur-sm transition-opacity duration-300" />
                <img
                    src="/image2.jpg"
                    alt="UniConnect"
                    className={`${s.img} bg-white object-cover rounded-xl border-2 border-white shadow-md relative z-10 transition-transform duration-300 group-hover:scale-105`}
                />
                {/* Point vert "en ligne" */}
                <span className={`absolute -bottom-0.5 -right-0.5 ${s.dot} bg-emerald-500 border-2 border-white rounded-full z-20`} />
            </div>

            {/* Wordmark */}
            {showText && (
                <span
                    className={`font-black tracking-tight leading-none ${s.text}`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    <span style={{ color: 'var(--text-1)' }}>Uni</span>
                    <span
                        style={{
                            background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Connect
                    </span>
                </span>
            )}
        </div>
    );
}