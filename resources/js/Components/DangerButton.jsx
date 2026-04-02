export default function DangerButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={[
                'inline-flex items-center justify-center gap-2',
                'px-5 py-2.5 rounded-xl',
                'bg-red-500 text-white text-sm font-bold',
                'shadow-md shadow-red-100',
                'transition-all duration-200',
                'hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-red-200',
                'active:translate-y-0 active:bg-red-700',
                'focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2',
                'disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none',
                className,
            ].join(' ')}
        >
            {children}
        </button>
    );
}