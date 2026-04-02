export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={[
                'inline-flex items-center justify-center gap-2',
                'px-6 py-2.5 rounded-xl',
                'bg-gradient-to-r from-blue-600 to-indigo-600',
                'text-white text-sm font-bold',
                'shadow-md shadow-blue-100',
                'transition-all duration-200',
                'hover:opacity-90 hover:-translate-y-0.5 hover:shadow-blue-200',
                'active:translate-y-0',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none',
                className,
            ].join(' ')}
        >
            {children}
        </button>
    );
}