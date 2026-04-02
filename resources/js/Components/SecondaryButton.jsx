export default function SecondaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={[
                'inline-flex items-center justify-center gap-2',
                'px-5 py-2.5 rounded-xl',
                'bg-slate-100 text-slate-700 text-sm font-bold',
                'border border-slate-200',
                'transition-all duration-200',
                'hover:bg-slate-200 hover:text-slate-900',
                'active:bg-slate-300',
                'focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2',
                'disabled:opacity-40 disabled:cursor-not-allowed',
                className,
            ].join(' ')}
        >
            {children}
        </button>
    );
}