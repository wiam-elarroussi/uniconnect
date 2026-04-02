export default function InputError({ message, className = '', ...props }) {
    if (!message) return null;
    return (
        <p
            {...props}
            className={[
                'flex items-center gap-1 mt-1.5',
                'text-xs font-medium text-red-500',
                className,
            ].join(' ')}
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                 className="w-3.5 h-3.5 flex-shrink-0">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {message}
        </p>
    );
}