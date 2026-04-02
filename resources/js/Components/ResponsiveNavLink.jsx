import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={[
                'flex w-full items-center gap-2.5',
                'px-4 py-2.5 rounded-xl mx-1',
                'text-sm font-semibold',
                'transition-all duration-150',
                'focus:outline-none',
                active
                    ? 'bg-blue-50 text-blue-700 border border-blue-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent',
                className,
            ].join(' ')}
        >
            {/* Indicateur actif */}
            {active && (
                <span className="w-1 h-4 rounded-full bg-gradient-to-b from-blue-600 to-indigo-500 flex-shrink-0" />
            )}
            {children}
        </Link>
    );
}